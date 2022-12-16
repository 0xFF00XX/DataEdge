## Scripts
# Polling
Polls bitsIn/Out in specified time range and calculates 95/98 percentiles.

Methodology:
Pulls data for each day within specified range via separate requests and calculates 95percentile as well as min and max.

Gets 95 percent specifically from CABI to match results as they may differ.

TODO: 
|    JS     | Python|
| --------- | -----:|
| - [x] aquire date, parse into epoch, poll data in specified time range| $1600 |
| Phone     |   $12 |
| Pipe      |    $1 |

- [x] aquire date, parse into epoch, poll data in specified time range
	- [ ] more testing required.
- [ ] request 95 perc from odata directly
- [ ] request details like ip, start time, end time from user, group name from user
- [ ] prettify output using `tabulate`