#!/usr/bin/env python3
"""Visual testing script for Atrija site via Chromium CDP.
Usage: python3 test-visual.py [url]
Default: http://127.0.0.1:8080
"""
import json, sys, time, base64, websocket, collections
from PIL import Image

CDP_URL = "http://localhost:9222"
TARGET_URL = sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:8080"

def get_page():
    import urllib.request
    resp = urllib.request.urlopen(f"{CDP_URL}/json")
    pages = json.loads(resp.read())
    for p in pages:
        if p.get("type") == "page":
            return p["id"]
    # open new page
    resp = urllib.request.urlopen(f"{CDP_URL}/json/new?{TARGET_URL}")
    page = json.loads(resp.read())
    time.sleep(8)
    return page["id"]

def eval_js(ws, expr, timeout=15):
    ws.send(json.dumps({
        "id": 1,
        "method": "Runtime.evaluate",
        "params": {"expression": expr, "returnByValue": True}
    }))
    ws.settimeout(timeout)
    resp = json.loads(ws.recv())
    return resp.get("result", {}).get("result", {}).get("value")

def screenshot(ws, path="/tmp/van-gogh-test.png"):
    ws.send(json.dumps({
        "id": 2,
        "method": "Page.captureScreenshot",
        "params": {"format": "png"}
    }))
    resp = json.loads(ws.recv())
    if "result" in resp and "data" in resp["result"]:
        with open(path, "wb") as f:
            f.write(base64.b64decode(resp["result"]["data"]))
        return path
    return None

def analyze_colors(path):
    img = Image.open(path)
    pixels = list(img.getdata())
    colors = collections.Counter()
    for p in pixels[::100]:
        r, g, b = p[0]//32*32, p[1]//32*32, p[2]//32*32
        colors[(r,g,b)] += 1

    total_sample = len(pixels[::100])
    dark = sum(1 for p in pixels[::100] if p[0] < 30 and p[1] < 30 and p[2] < 40)
    warm = sum(1 for p in pixels[::100] if p[0] > 150 and p[1] > 100 and p[2] < 100)
    white = sum(1 for p in pixels[::100] if p[0] > 200 and p[1] > 200 and p[2] > 200)
    green = sum(1 for p in pixels[::100] if p[1] > 100 and p[1] > p[0] and p[1] > p[2])
    avg = sum(sum(p[:3])/3 for p in pixels[::100]) / total_sample

    print(f"\n📊 Color Analysis ({img.size[0]}x{img.size[1]}):")
    print(f"  Dark: {dark/total_sample*100:.1f}% | Warm: {warm/total_sample*100:.1f}% | White: {white/total_sample*100:.1f}% | Green: {green/total_sample*100:.1f}%")
    print(f"  Avg brightness: {avg:.0f}/255")
    print(f"  Top colors: {colors.most_common(5)}")

def main():
    page_id = get_page()
    ws = websocket.create_connection(f"ws://localhost:9222/devtools/page/{page_id}", timeout=15)

    # Check page state
    ready = eval_js(ws, "document.readyState")
    print(f"📄 Page readyState: {ready}")

    # Check scene
    scene_info = eval_js(ws, """JSON.stringify({
        sceneReady: window.__sceneReady,
        sceneFailed: window.__sceneFailed,
        canvasCount: document.getElementById('canvas-container')?.querySelectorAll('canvas').length || 0,
        bodyLen: document.body.innerHTML.length,
        visibleReveals: document.querySelectorAll('.reveal.visible, .reveal-left.visible, .reveal-scale.visible').length,
        totalReveals: document.querySelectorAll('.reveal, .reveal-left, .reveal-scale').length
    })""")
    print(f"🎬 Scene: {scene_info}")

    # Check flowers (3D objects in scene)
    flower_info = eval_js(ws, """(() => {
        const c = document.getElementById('canvas-container');
        const canvases = c?.querySelectorAll('canvas') || [];
        // Check if any canvas has WebGL content
        let hasGL = false;
        canvases.forEach(canvas => {
            const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
            if (gl) hasGL = true;
        });
        return JSON.stringify({canvasCount: canvases.length, hasWebGL: hasGL});
    })()""")
    print(f"🌸 3D Canvas: {flower_info}")

    # Screenshot
    path = screenshot(ws)
    if path:
        print(f"📸 Screenshot: {path}")
        analyze_colors(path)

    # Check console errors
    errors = eval_js(ws, """(() => {
        // Check if error UI is shown
        const errEl = document.getElementById('scene-error');
        const errStyle = errEl ? window.getComputedStyle(errEl) : null;
        const isErrorVisible = errStyle && errStyle.display !== 'none';
        const errMsg = document.getElementById('scene-error-msg')?.textContent || '';
        return JSON.stringify({errorVisible: isErrorVisible, errorMsg: errMsg});
    })()""")
    print(f"⚠️ Errors: {errors}")

    ws.close()
    return path

if __name__ == "__main__":
    main()
