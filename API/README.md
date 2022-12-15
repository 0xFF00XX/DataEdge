## Scripts
# Polling
Polls bitsIn/Out in specified time range and calculates 95/98 percentiles.

Methodology:
Pulls data for each day within specified range via separate requests and calculates 95percentile as well as min and max.

Gets 95 percent specifically from CABI to match results as they may differ.

TODO: 
- aquire date, parse into epoch, poll data in specified time range
- request 95 perc from odata
- request details like ip, start time, end time from user, group name from user
- 