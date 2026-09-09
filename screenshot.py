import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page()
        page.set_default_timeout(30000)
        
        # Try localhost first, then IP if it fails
        urls = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://10.44.34.29:5173']
        success = False
        
        for url in urls:
            try:
                print(f"Trying {url}...")
                await page.goto(url, wait_until='networkidle')
                success = True
                print(f"Successfully loaded {url}")
                break
            except Exception as e:
                print(f"Failed to load {url}: {e}")
                
        if success:
            await page.screenshot(path='/home/kali/.gemini/antigravity-ide/brain/b308dfe2-f33b-4259-94fa-755c720cf586/dev_server_screenshot.png', full_page=True)
            print("Screenshot saved to dev_server_screenshot.png")
        else:
            print("Could not load the dev server on any URL.")
            
        await browser.close()

asyncio.run(main())
