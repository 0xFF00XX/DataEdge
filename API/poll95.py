import requests
import os
import json
from datetime import datetime, timezone
from tabulate import tabulate

# TODO:
#set days. Get data for end of day, biginning of day and in between


GROUP_NAME = "DEL_98_Test"
ip = "10.0.0.93"
HOURS_in_DAY = 24
MINS_in_HOUR = 60
SECS_in_MIN = 60
FULL_DAY = 86400
# startTime = 1670371200

#1 dec 0000
startTime = 1669852800
# endTime = 1670457600

#8 dec 0600
endTime = 1670479200
# "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=288&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq 'DEL_98_Test'))"
bitsIn = []
bitsOut = []
timeStamp = []
numberOfDays = 0
numberOfHours = 0
#if there are even 24 cycles in all timespan.
isEvenDay = True


#request data from odata and assign to lists
def requestData(startTime,endTime, numberOfEntries):
        url = "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=" + str(numberOfEntries)+"&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq '"+GROUP_NAME+"'))"
        # url = "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=" + str(numberOfEntries)+"&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq '"+GROUP_NAME+"'))"
        r = requests.get(url, auth=('admin', '!DataOverEdge!'))
        # print(r.text)
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

    # deltaTime = endTime - startTime
    # deltaHours = ((deltaTime / SECS_in_MIN) / MINS_in_HOUR)
    #if even amount of days. e.g. from 15/01/22 00:00 to 15/02/22 00:00
    # if(deltaHours % HOURS_in_DAY == 0):
    #     numberOfDays = deltaHours/HOURS_in_DAY
    #     # print(numberOfDays)
    # for i in range(1,int(numberOfDays)+1):
    #     print(i)
    localStart = startTime
    localEnd = endTime
    isRunning = True
    counter = 0
    while isRunning:
        print(counter)

    #if even 24 cycle
        if(localStart + FULL_DAY <= endTime):
            # print("full day")
            localEnd = localStart + FULL_DAY
            numberOfEntries = 288
            # print(localStart)
            # print(localEnd)

            requestData(localStart, localEnd, numberOfEntries)
            localStart = localStart + FULL_DAY
        elif(localStart == endTime):
            break
        else:
            print("less than a day")
            #if less than a day left then number of entries is different
            numberOfEntries = int(((endTime - localStart)/SECS_in_MIN) // 5)
            print(numberOfEntries)
            requestData(localStart, endTime, numberOfEntries)
            break
        counter += 1
    # numberOfEntries = 288
    # requestData(startTime, endTime, numberOfEntries)
    # sortBits(bitsIn)
    # sortBits(bitsOut)
    print("Start Time")
    print(datetime.fromtimestamp(int(timeStamp[0])).strftime('%Y-%m-%d %H:%M:%S'))
    print()
    print("BitsIn max")
    print(max(bitsIn)/10**9)
    print()
    print("BitsIn min")
    print(min(bitsIn)/10**9)
    print()
    print("BitsIn 95 percent")
    print(get95perc(bitsIn)/10**9)
    print("End Time")
    print()
    print(datetime.fromtimestamp(int(timeStamp[-1])).strftime('%Y-%m-%d %H:%M:%S'))
    print()
    # # print(get98perc(bitsIn)/10**9)
    # for i in timeStamp:
    #     if (timeStamp.count(i) > 0):
    #         print(i)













    # bitsOut.append(i['im_bitsOut'])
