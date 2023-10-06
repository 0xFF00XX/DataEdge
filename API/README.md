
# How To Use 95th Percentile Project

This website is an imitation of CA CABI.
It gets data from the Data Aggregator, processes it, plots a graph and fills up a table.

Table returns 95th and 98th percentiles which are identical to CABIs result.

Project uses multiple CDN links, access to internet required, unless all necessary packages are downloaded locally.


## Pre-requisites

- python3 
- itnernet access (optional with local CDN libs)
- connection to DA

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


# Future Updates

1. Implement group selection using GroupChilren data (now can only add groups manually through `HTML` code).
	- add 'Other...' option in group selection to add more
	- create pop up that will pull and display all groups.
	- add to favourites to have needed groups in quick access. 
1. More extensive error messages.
	- if Timestamp misses few dates - mark them as 'data unavailable'
	- if group has no devices etc
1. ability to select multiple groups or metrics. 
1. ability to specify rounding



