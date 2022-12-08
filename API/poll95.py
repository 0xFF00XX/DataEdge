import requests
import os
import json
from tabulate import tabulate

ip = "10.0.0.93"
startTime = 1670371200
endTime = 1670457600
url = "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=288&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq 'DEL_98_Test'))"
# "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=288&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq 'DEL_98_Test'))"
bitsIn = []
bitsOut = []
timeStamp = []



#request data from odata and assign to lists
def requestData(ip, startTime,endTime):

    r = requests.get(url, auth=('admin', '!DataOverEdge!'))
    data = json.loads(r.text)["d"]["results"][0]["portmfs"]["results"]
    # data = json.loads(r.text)["d"]["results"]["portmfs"]["results"]

    for i in data:
        # print(i)
        timeStamp.append(i['Timestamp'])
        #append bits in/out to list. filter none type as 0
        try:
            bitsIn.append(float(i['im_BitsIn']))
            # bitsIn.append([i['Timestamp'],float(i['im_BitsIn'])])
        except TypeError as e:
            bitsIn.append(float(0))
        #out
        try:
            # bitsOut.append([i['Timestamp'],float(i['im_BitsOut'])])
            bitsOut.append(float(i['im_BitsOut']))
        except TypeError as e:
            bitsOut.append(float(0))


#sort data


def get95perc(sortedList):
    sortedList.sort()
    index = int(round(len(sortedList)*0.95, 0))
    return sortedList[index]

def get98perc(sortedList):
    sortedList.sort()
    index = int(round(len(sortedList)*0.98, 0))
    return sortedList[index]


if (__name__ == "__main__"):
    # print(bitsOut)

    requestData(ip,startTime,endTime)
    # sortBits(bitsIn)
    # sortBits(bitsOut)

    print(get95perc(bitsIn)/10**9)
    print(get98perc(bitsIn)/10**9)














    # bitsOut.append(i['im_bitsOut'])
