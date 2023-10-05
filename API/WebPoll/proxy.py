import http.server
import socketserver
import urllib.request
import base64
import config

# config includes
# DA IP address
# Username
# Password

# Define the proxy server configuration
PORT = 8000  # Choose a port for your proxy server
TARGET_HOST = config.ip  # Replace with the base URL of the external API
TARGET_PORT = 8581  # Default HTTP port

class ProxyHandler(http.server.CGIHTTPRequestHandler):
        # Allow all origins by setting CORS headers for both OPTIONS and GET requests
    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("mode", "no-cors")
        self.end_headers()


    def do_GET(self):
        # Build the target URL
        target_url = f"http://{TARGET_HOST}:{TARGET_PORT}{self.path}"
        # print(target_url)
        # Create a proxy request to the target URL
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        super().end_headers()

        try:
            username = config.username
            password = config.password
            auth_header = {"Authorization": f"Basic {base64.b64encode(f'{username}:{password}'.encode()).decode()}"}
            request = urllib.request.Request(target_url, headers=auth_header)
            # Fetch content from the target server
            print("[+] request sent")
            with urllib.request.urlopen(request) as response:
                content = response.read()
                # print(type(content))
                print(content)
                # content = content.decode('utf-8')

                self.wfile.write(content)
        except Exception as e:
            print("Error:", e)

# Create the proxy server
with socketserver.TCPServer(("", PORT), ProxyHandler) as httpd:
    print(f"Proxy server is running on port {PORT}")
    httpd.serve_forever()
