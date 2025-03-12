import http.server
import socketserver
import os

# Change directory to the static files
os.chdir(os.path.join(os.path.dirname(__file__), 'src', 'main', 'resources', 'static'))

PORT = 8000
Handler = http.server.SimpleHTTPRequestHandler

print(f"Starting server at http://localhost:{PORT}")
print("Press Ctrl+C to stop the server") 

with socketserver.TCPServer(("", PORT), Handler) as httpd:
    httpd.serve_forever() 
