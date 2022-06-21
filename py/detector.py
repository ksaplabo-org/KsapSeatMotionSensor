class Detector:
    
    def __init__(self, addr):
        self.__addr = addr
        self.__state = ""

    def get_addr(self):
        """getter
        """

        return self.__addr
    
    def get_state(self):
        """getter
        """

        return self.__state

    def __set_state(self, state):
        """setter
        """

        self.__state = state

    def compare_res(self, new_state):
        """前回の着席情報と比較
           同じ　:True
           異なる:状態を更新し、False
        """
        
        if self.__state == new_state:
            return True
        else:
            self.__set_state(new_state)
            return False

        