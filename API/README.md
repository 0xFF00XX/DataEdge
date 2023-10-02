
# 95th Percentile Project

This website is an imitation of CA CABI.
It gets data from the Data Aggregator, processes it, plots a graph and fills up a table.

Table returns 95th and 98th percentiles which are identical to CABIs result.

Project uses multiple CDN links, access to internet required, unless all required packages are downloaded locally.


## Pre-requisites

- python3 
- itnernet access (optional with local CDN libs)
## Configuration

create `config.py` file in the same directory.

```
touch config.py
```

Provide `ip`, `username` and `password` of Data Aggregator.

```python
ip = "10.0.0.1"
username = "username"
password = "password"
```

 In `poll95.js` file on line `#20` change the following:

- `ip` - to the local IP of the machine where the script is running (not 127.0.0.1)

 
 ```javascript
const ip = "";
const port = "8000";

 ```

 
## Deployment

#### Deploy proxy first. 

Requests are sent from frontend JS. Browsers have issue with

```bash
  python3 proxy.py
```

Serve the website (python in this case)

```bash
python -m http.server --bind <YOUR_LOCAL_MACHINE_IP> <LOCAL PORT>
```
Website is now live and accessible on http://**IP**:**Port**


## Usage/Examples

- Navigate to link from above
- Select desired group
- Select desired metric
- select desired time frame
- click "Submit"



