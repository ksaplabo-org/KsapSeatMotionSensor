import detector
import logger
from bluepy import btle

ESP1_MAC_ADDRESS = "78:21:84:7f:6d:de"
ESP2_MAC_ADDRESS = "40:91:51:be:e8:5a"
 
detctor_list = []
#detctor_list.append(detector.Detector(ESP1_MAC_ADDRESS))
detctor_list.append(detector.Detector(ESP2_MAC_ADDRESS))

scanner = btle.Scanner(0)
__logger = logger.Logger()

while True: 
  
  #Bluetoothデバイスの検索
  devices = scanner.scan(3.5)

  #検索結果分ループ
  for device in devices:

    #設置しているデバイス分ループ
    for esp_device in detctor_list:
      
      #MACアドレスが一致するものを探す
      if esp_device.get_addr() == device.addr:
        
        #取得した情報を展開
        for (adTypeCode, description, valueText) in device.getScanData():
          #print(f'    {description}：{valueText}')
          if description == "16b Service Data":

            #前回の着席状況を比較し、異なる場合はログを送信
            print(valueText[4:6])
            if not esp_device.compare_res(valueText[4:6]):
              print('send')
              __logger.write(esp_device.get_addr(),esp_device.get_state())
            else:
              print('pass')

