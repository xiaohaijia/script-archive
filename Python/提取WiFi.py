import subprocess
import logging
import os

# 配置日志记录
logging.basicConfig(filename='wifi_extractor.log', level=logging.ERROR,
                    format='%(asctime)s - %(levelname)s - %(message)s')

def get_wifi_profiles():
    try:
        # 执行netsh命令获取所有已连接过的WiFi配置文件
        command = 'netsh wlan show profiles'
        result = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
        output = result.stdout
        if output is None:
            return []
        # 提取所有WiFi名称（SSID）
        wifi_profiles = []
        for line in output.split('\n'):
            if "所有用户配置文件" in line:
                try:
                    profile_name = line.split(':')[1].strip()
                    wifi_profiles.append(profile_name)
                except IndexError:
                    continue
        return wifi_profiles
    except Exception as e:
        logging.error(f"Error in get_wifi_profiles: {e}")
        return []

def get_wifi_password(profile_name):
    try:
        # 执行netsh命令获取指定WiFi配置文件的详细信息，包括密码
        command = f'netsh wlan show profile name="{profile_name}" key=clear'
        result = subprocess.run(command, capture_output=True, text=True, encoding='utf-8')
        output = result.stdout
        if output is None:
            return None
        # 提取密码
        password = None
        for line in output.split('\n'):
            if "关键内容" in line:
                try:
                    password = line.split(':')[1].strip()
                except IndexError:
                    continue
                break
        return password
    except Exception as e:
        logging.error(f"Error in get_wifi_password for {profile_name}: {e}")
        return None

def main():
    try:
        # 获取所有已连接过的WiFi配置文件
        wifi_profiles = get_wifi_profiles()

        # 遍历每个WiFi配置文件，获取对应的密码
        wifi_info = []
        for profile_name in wifi_profiles:
            password = get_wifi_password(profile_name)
            wifi_info.append({
                'SSID': profile_name,
                'Password': password
            })

        # 打印WiFi信息
        for info in wifi_info:
            print(f"SSID: {info['SSID']}")
            if info['Password']:
                print(f"Password: {info['Password']}")
            else:
                print("Password: Not available")
            print("-" * 30)
    except Exception as e:
        logging.error(f"Error in main: {e}")

    # 暂停窗口，等待用户操作
    os.system('pause')

if __name__ == "__main__":
    main()