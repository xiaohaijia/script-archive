import requests
from bs4 import BeautifulSoup
import pymysql
import time

"""
从国家统计局爬取省市区数据
"""


class area(object):
    def __init__(self):
        self.db = pymysql.connect(host="10.80.28.111", user="anlishen", password="123456", database="test")
        self.main()
        self.db.close()

    def main(self):
        # 年份
        year = 2023
        base_url = 'https://www.stats.gov.cn/sj/tjbz/tjyqhdmhcxhfdm/%s/' % year
        sql = "insert into area (area_code,area_name,parent_code,parent_id,area_level) values (%s,%s,%s,%s,%s)"
        trs = self.get_response(base_url, 'provincetr')
        for tr in trs:  # 循环每一行
            for td in tr:  # 循环每个省
                if td.a is None:
                    continue
                href_url = td.a.get('href')
                province_name = td.a.get_text()
                province_code = str(href_url.split(".")[0]);
                province_url = base_url + href_url

                print('1级-'+province_name)

                # 插入省份数据并获取主键
                province_data = [province_code, province_name, '0', 0, 1]
                province_id = self.connect_mysql(sql, province_data)

                trs = self.get_response(province_url, "citytr")
                for tr in trs:  # 循环每个市
                    city_code = tr.find_all('td')[0].string
                    city_name = tr.find_all('td')[1].string
                    print('2级-'+city_name)
                    # 插入城市数据并获取主键
                    city_data = [city_code, city_name, province_code, province_id, 2]
                    city_id = self.connect_mysql(sql, city_data)


                    if tr.find_all('td')[1].a is None:
                        continue
                    if tr.find_all('td')[1].a.get('href') is None:
                        continue
                    city_url = base_url + str(tr.find_all('td')[1].a.get('href'))
                    a_url = str(tr.find_all('td')[1].a.get('href')).split("/")[0]
                    trs = self.get_response(city_url, "countytr")
                    for tr in trs:  # 循环每个区县
                        county_code = tr.find_all('td')[0].string
                        county_name = tr.find_all('td')[1].string
                        print('3级-'+county_name)
                        # 插入区县数据并获取主键
                        county_data = [county_code, county_name, city_code, city_id, 3]
                        county_id = self.connect_mysql(sql, county_data)


                        if tr.find_all('td')[1].a is None:
                            continue
                        if tr.find_all('td')[1].a.get('href') is None:
                            continue
                        b_url = str(tr.find_all('td')[1].a.get('href')).split('/')[0]
                        county_url = base_url + a_url + '/' + str(tr.find_all('td')[1].a.get('href'))
                        trs = self.get_response(county_url, "towntr")
                        for tr in trs:  # 循环每个乡镇
                            town_code = tr.find_all('td')[0].string
                            town_name = tr.find_all('td')[1].string
                            print('4级-'+town_name)
                            # 插入乡镇数据并获取主键
                            town_data = [town_code, town_name, county_code, county_id, 4]
                            town_id = self.connect_mysql(sql, town_data)

                            if tr.find_all('td')[1].a is None:
                                continue
                            if tr.find_all('td')[1].a.get('href') is None:
                                continue
                            town_url = base_url +a_url+'/'+b_url + '/' + str(tr.find_all('td')[1].a.get('href'))
                            trs = self.get_response(town_url, "villagetr")
                            for tr in trs:  # 循环每个社区、村委会
                                village_code = tr.find_all('td')[0].string
                                village_name = tr.find_all('td')[2].string
                                print('5级-'+village_name)
                                # 插入社区、村委会数据并获取主键
                                village_data = [village_code, village_name, town_code, town_id, 5]
                                village_id = self.connect_mysql(sql, village_data)
                            time.sleep(1)
                        time.sleep(1)
                    time.sleep(1)
                time.sleep(1)
            time.sleep(1)

    @staticmethod
    def get_response(url, attr):
        response = requests.get(url)
        response.encoding = 'UTF-8'  # 编码转换
        soup = BeautifulSoup(response.text, features="html.parser")
        table = soup.find_all('tbody')[1].tbody.tbody.table
        if attr:
            trs = table.find_all('tr', attrs={'class': attr})
        else:
            trs = table.find_all('tr')
        return trs

    def connect_mysql(self, sql, data):
        cursor = self.db.cursor()
        try:
            result = None
            if data:
                if isinstance(data[0], list):
                    cursor.executemany(sql, data)
                    result = self.db.insert_id()
                    print()
                else:
                    cursor.execute(sql, data)
                    result = self.db.insert_id()
            else:
                cursor.execute(sql)
                cursor.fetchall()
                result = self.db.insert_id()
        except Exception as e:
            print(e)
            self.db.rollback();
        finally:
            cursor.close()
            self.db.commit()
            return result


if __name__ == '__main__':
    area()
