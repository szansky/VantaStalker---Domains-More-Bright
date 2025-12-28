import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import io
import re
from typing import Dict, Any, List

# Try importing pypdf, handle if missing
try:
    from pypdf import PdfReader
    HAS_PYPDF = True
except ImportError:
    HAS_PYPDF = False

def extract_metadata(domain: str) -> Dict[str, Any]:
    url = f"https://{domain}"
    results = {
        "files_found": [],
        "metadata_extracted": []
    }

    try:
        resp = requests.get(url, timeout=5, headers={
             "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        })
        soup = BeautifulSoup(resp.text, 'html.parser')
        
        # 1. Find Documents
        doc_extensions = ['.pdf', '.docx', '.xlsx', '.pptx']
        found_urls = set()
        
        for link in soup.find_all('a', href=True):
            href = link['href']
            full_url = urljoin(url, href)
            lower_url = full_url.lower()
            
            if any(lower_url.endswith(ext) for ext in doc_extensions):
                found_urls.add(full_url)
                
        results["files_found"] = list(found_urls)[:10] # Limit to 10
        
        # 2. Analyze files
        # 2a. PDFs
        if HAS_PYPDF:
            pdfs = [u for u in found_urls if u.lower().endswith('.pdf')][:3]
            for pdf_url in pdfs:
                try:
                    r = requests.get(pdf_url, timeout=5)
                    f = io.BytesIO(r.content)
                    reader = PdfReader(f)
                    meta = reader.metadata
                    
                    if meta:
                        cleaned_meta = {}
                        if meta.author: cleaned_meta['Author'] = meta.author
                        if meta.creator: cleaned_meta['Creator'] = meta.creator
                        if meta.producer: cleaned_meta['Producer'] = meta.producer
                        if meta.title: cleaned_meta['Title'] = meta.title
                        
                        if cleaned_meta:
                            results["metadata_extracted"].append({
                                "file": pdf_url.split('/')[-1],
                                "type": "PDF",
                                "meta": cleaned_meta
                            })
                except:
                    pass

        # 2b. Office Files (DOCX, XLSX, PPTX)
        import zipfile
        from xml.etree import ElementTree as ET

        office_files = [u for u in found_urls if u.lower().endswith(('.docx', '.xlsx', '.pptx'))][:3]
        for office_url in office_files:
            try:
                r = requests.get(office_url, timeout=5)
                f = io.BytesIO(r.content)
                
                if zipfile.is_zipfile(f):
                    with zipfile.ZipFile(f) as zf:
                        if 'docProps/core.xml' in zf.namelist():
                            core_xml = zf.read('docProps/core.xml')
                            root = ET.fromstring(core_xml)
                            
                            # Namespaces usually used in Office Open XML
                            ns = {
                                'dc': 'http://purl.org/dc/elements/1.1/',
                                'cp': 'http://schemas.openxmlformats.org/package/2006/metadata/core-properties'
                            }
                            
                            office_meta = {}
                            creator = root.find('dc:creator', ns)
                            if creator is not None and creator.text: office_meta['Author'] = creator.text
                            
                            last_mod = root.find('cp:lastModifiedBy', ns)
                            if last_mod is not None and last_mod.text: office_meta['Last Modified By'] = last_mod.text
                            
                            created = root.find('dcterms:created', {'dcterms': 'http://purl.org/dc/terms/'})
                            # detailed fallback for created date if needed, but Author is most important for Intel
                            
                            if office_meta:
                                results["metadata_extracted"].append({
                                    "file": office_url.split('/')[-1],
                                    "type": "Office",
                                    "meta": office_meta
                                })
            except:
                pass

    except Exception as e:
        results["error"] = str(e)

    return results
