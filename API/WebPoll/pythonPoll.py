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

#10th sept 2023 0100 am
startTime = 1694307600
# endTime = 1670457600

#11th sept 2023 0100 am
endTime = 1694394000
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
        url= "http://172.23.246.49:8581/odata/api/groups?$top=20000&skip=0&top=20000&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/max_im_BitsIn&$filter=((Name eq 'BIP'))"
        print()
        # url = "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=" + str(numberOfEntries)+"&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq '"+GROUP_NAME+"'))"
        # url = "http://"+ip+":8581/odata/api/groups?$top=50&$skip=0&top=" + str(numberOfEntries)+"&&resolution=RATE&starttime="+str(startTime)+"&endtime="+str(endTime)+"&$format=json&$expand=portmfs&$select=ID,Name,portmfs/Timestamp,portmfs/im_BitsIn,portmfs/im_BitsOut&$filter=((Name eq '"+GROUP_NAME+"'))"
        r = requests.get(url, auth=('admin', '@Pass2022A'))
        # print(r.text)
        print()
        data = json.loads(r.text)["d"]["results"][0]["portmfs"]["results"]
        # data = json.loads(r.text)["d"]["results"]["portmfs"]["results"]
        print(url)
        sums = {}
        bitsIn = []
        for item in data:
            timestamp = item["Timestamp"]
            bits_in = item["max_im_BitsIn"]
            bitsIn.append(bits_in)
            # If the timestamp is not in the sums dictionary, initialize it
            if timestamp not in sums:
                sums[timestamp] = float(bits_in)
            else:
                # If the timestamp is already in the sums dictionary, add the bits_in value to the sum
                sums[timestamp] += float(bits_in)

        # Convert the sums dictionary to a list of dictionaries
        result = [{"Timestamp": key, "SumBitsIn": value} for key, value in sums.items()]

        result.sort(key=lambda x: x["SumBitsIn"], reverse=True)
        #print(result)
        bitsIn = []
        for i in result:
            bitsIn.append(i['SumBitsIn'])

        print(len(result))

        line = len(result)
        for i in result:
            print(str(line) + ". " +  str(i['SumBitsIn']))
            line -= 1
        bitsIn = sorted(bitsIn, reverse=False)
        n = len(bitsIn)
        #position in the sorted array of values where the desired quantile falls.

        h = (n - 1) * 0.98 + 1
        #rouding to nearest int
        h_floor = int(h)
        #get value below h
        v = bitsIn[h_floor-1]
        #calculates the "fractional" part of the H value, which represents how far the quantile is between the elements at indices h - 1 and h.
        e = h - h_floor
        # if e not 0 interpolate values
        if (e != 0):
            v += e * (bitsIn[h_floor] - v)
        print(v)

       # sortedBits = sorted(bitsIn, reverse=True)
        #position = len(sortedBits)*0.98
        #print(position)
        #print(str(int(position)) + ". " + str(sortedBits[int(position)]))
        #print(sortedBits)
            #out
            # try:
            #     # bitsOut.append([i['Timestamp'],float(i['im_BitsOut'])])
            #     bitsOut.append(float(i['im_BitsOut']))
            # except TypeError as e:
            #     bitsOut.append(float(0))
            # except KeyError as ke:
            #     print()
            #     print("No bits out\n")
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
    numberOfEntries = 288
    requestData(localStart,localEnd, numberOfEntries)
    # print(bitsIn)
    # print()
    # print(sorted(bitsIn, reverse=True))
    # print()
    # print(sorted(bitsIn, reverse=True)[0])
    # print()
    # print(len(bitsIn))

    # print("Start Time")
    # print(datetime.fromtimestamp(int(timeStamp[0])).strftime('%Y-%m-%d %H:%M:%S'))
    # print()
    # print("BitsIn max")
    # print(max(bitsIn)/10**9)
    # print()
    # print("BitsIn min")
    # print(min(bitsIn)/10**9)
    # print()
    # print("BitsIn 95 percent")
    # print(get95perc(bitsIn)/10**9)
    # print("End Time")
    # print()
    # print(datetime.fromtimestamp(int(timeStamp[-1])).strftime('%Y-%m-%d %H:%M:%S'))
    # print()
