import motion_detector as md
import time
import logger

count = 0

#使用しているESPの数だけ宣言する
ESP1_MAC_ADDRESS = "78:21:84:7f:6D:DE"
ESP2_MAC_ADDRESS = "40:91:51:BE:F7:8E"
#ESP2_MAC_ADDRESS = "40:91:51:BE:E8:5A"

detctor_list = []
#detctor_list.append(md.motion_detector(ESP1_MAC_ADDRESS))
detctor_list.append(md.motion_detector(ESP2_MAC_ADDRESS))


logger = logger.Logger()

while True:    
    for detector in detctor_list:
        print(detector.read())
        print(count)

    #30秒カウント
    if count == 15:
        #ESPの数だけループ
        for detector in detctor_list:
            #着席状態を確認
            if detector.check_state():
                print("Sit")
                logger.write(detector._addr,"Sit")    
            else:
                print("Stand")
                logger.write(detector._addr,"Stand")
        count = 0
        continue

    count = count + 1
    time.sleep(1)


