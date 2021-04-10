from selenium import webdriver
from twocaptcha import TwoCaptcha
import time
from fake_useragent import UserAgent
from threading import Thread
import random
import requests
import string

solver = TwoCaptcha('f668b604d0954938b5c223f22ca1f90c')
apiKey = 'b2UOnh0HVAAljzfOLLdNvQ7uzu5gkiiMqn7h7sKcdeQv'

def tool(thread):
    invite_code_list = []
    with open('invite_code.txt','r') as f:
        Lines = f.readlines() 
        for line in Lines: 
            invite_code_list.append(line[:-1])

    for job in range(1,100):
        try: 
            ua = UserAgent()
            userAgent = ua.random

            PROXY = randomIP(API_KEY_LIST[thread])
            print("CONNECT {}".format(PROXY))

            chrome_options = webdriver.ChromeOptions()

            chrome_options.add_argument(f'user-agent={userAgent}')
            chrome_options.add_argument('--proxy-server=%s' % PROXY)
            chrome_options.add_argument("--window-size=300,800")
            # chrome_options.add_argument("disable-gpu")
            # chrome_options.add_argument('headless')
            chrome_options.add_argument("--incognito")

            print(userAgent)
            
            PATH = '/home/ngocdoanh/Desktop/Cheat-ref-5/chromedriver_linux64/chromedriver'

            driver = webdriver.Chrome(PATH, chrome_options=chrome_options)

            driver.get("https://www.bwcp68.top/xml/index.html#/register")
            

            i = random.randint(1, 10000000)

            print(i)

            sdt = 370000000 + i 
            
            imageURL = './captcha/{}.png'.format(thread)

            print(imageURL)

            driver.find_elements_by_class_name("van-image__img")[0].screenshot(imageURL)

            token = solver.normal(imageURL)

            codeCaptcha = token['code']

            print(codeCaptcha)
           
            time.sleep(2)
            
            randomPassword = password_generator()
            random_invite_code = random.randint(0,1)

            print(randomPassword)
            print(random_invite_code)

            account = sdt
            password = randomPassword
            repassword = randomPassword
            code = codeCaptcha
            invite_code = invite_code_list[random_invite_code]

            print(account)
            print(password)
            print(sdt)
            print(code)
            print(invite_code)

            driver.find_element_by_xpath("//input['data-v-7f6c9fc7'][@type='tel']").send_keys(account)
            time.sleep(2)
            driver.find_element_by_xpath("//input[@placeholder='Vui lòng nhập mã xác minh ']").send_keys(code)
            time.sleep(2)
            driver.find_element_by_xpath("//input[@placeholder='Vui lòng nhập mật khẩu đăng nhập']").send_keys(password)
            time.sleep(2)
            driver.find_element_by_xpath("//input[@placeholder='Vui lòng xác nhận mật khẩu của bạn']").send_keys(repassword)
            time.sleep(2)
            driver.find_element_by_xpath("//input[@placeholder='Vui lòng nhập mã mời']").send_keys(invite_code)
            time.sleep(2)
            driver.find_element_by_xpath("//button['data-v-7f6c9fc7'][@class='van-button van-button--danger van-button--large van-button--block van-button--round']").click()

            time.sleep(5)

            current_url = driver.current_url
            print(current_url)
            
            if current_url != 'https://www.bwcp68.top/xml/index.html#/register':
                urlSave = "{}.txt".format(thread)
                with open(urlSave,"a") as f:
                    f.write("{sdt}|{password}\n".format(sdt = sdt, password = password))
                    f.close()
            else:
                continue

            time.sleep(100)
            print("---Chuan bi thoat---")
            driver.quit()
        
        except:
            print("ERROR")
            time.sleep(100)
            driver.quit()
            continue
    return 0

LETTERS = string.ascii_letters
NUMBERS = string.digits  

def password_generator(length=8):
    '''
    Generates a random password having the specified length
    :length -> length of password to be generated. Defaults to 8
        if nothing is specified.
    :returns string <class 'str'>
    '''
 

    # create alphanumerical from string constants
    printable = f'{LETTERS}{NUMBERS}'

    # convert printable from string to list and shuffle
    printable = list(printable)
    random.shuffle(printable)

    # generate random password and convert to string
    random_password = random.choices(printable, k=length)
    random_password = ''.join(random_password)
    print("Hi")
    return random_password

def randomIP(API_KEY):

    url1 = "http://proxy.tinsoftsv.com/api/getProxy.php"
    url2 = "http://proxy.tinsoftsv.com/api/changeProxy.php"


    params1 = {
        'key': API_KEY,
    }

    params2 = {
        'key': API_KEY,
        'location': 0
    }


    while True:
        proxy = ''

        res = requests.get(url1, params=params1)
        time.sleep(10)
        
        print(res.text)

        if not res:
            time.sleep(10)
            continue
        
        if 'proxy' in res.json():
            if res.json()['next_change'] == 0:
                requests.get(url2, params=params2)
                continue
            else:
                proxy = res.json()['proxy']
                break
        else:
            time.sleep(15)
            re = requests.get(url2, params=params2)
            print(re.text)
            continue  
    
    return proxy
      
API_KEY_LIST = [
    'TLPylJHJlpvNHCvGj7SP8du2aVNL3ICxxVoDcv'
]


def main():
    thread_list = []
    for t in range(1):
        print(t)
        thread = Thread(target=tool, args=(t,))
        thread_list.append(thread)
        thread_list[t].start()


if __name__ == "__main__":
    main()
    print("DONE")

