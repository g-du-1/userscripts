import unittest
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import NoSuchElementException
import time

def check_exists_by_xpath(xpath, driver):
    try:
        driver.find_element(By.XPATH, xpath)
    except NoSuchElementException:
        return False
    return True

class RedditUXTest(unittest.TestCase):
    def setUp(self):
        chrome_options = Options()
        chrome_options.add_argument('--user-agent=Mozilla/5.0 (iPhone; CPU iPhone OS 10_3 like Mac OS X) AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75 Mobile/14E5239e Safari/602.1')
        chrome_options.add_argument("window-size=375,800")
        # chrome_options.add_experimental_option("detach", True)

        self.driver = webdriver.Chrome(options=chrome_options)
        self.driver.get("https://www.reddit.com")

        self.script_file = open("reddit-ux-fixer.js")
        self.script_contents = self.script_file.read()
        self.driver.execute_script(self.script_contents)

        body = self.driver.find_element(By.CSS_SELECTOR, "body")
        body.send_keys(Keys.END)

        time.sleep(1)

    def test_opens_reddit(self):
        driver = self.driver
        self.assertIn("Reddit", driver.title)

    def test_page_can_scroll(self):
        driver = self.driver

        curr_scroll_pos = driver.execute_script("return document.body.scrollTop")

        WebDriverWait(driver, 10).until(EC.visibility_of_element_located((By.CSS_SELECTOR, 'h1')))

        body = driver.find_element(By.CSS_SELECTOR, "body")
        body.send_keys(Keys.END)

        time.sleep(1)

        new_scroll_pos = driver.execute_script("return document.body.scrollTop")

        self.assertNotEqual(curr_scroll_pos, new_scroll_pos)

    def test_open_in_app_modal_does_not_exist(self):
        driver = self.driver
        self.assertFalse(check_exists_by_xpath('//*[text() = "Reddit App"]', driver))

    def test_top_use_app_btn_does_not_exist(self):
        driver = self.driver
        self.assertFalse(check_exists_by_xpath('//*[text() = "Use App"]', driver))

    def test_bottom_bar_does_not_exist(self):
        driver = self.driver
        self.assertFalse(check_exists_by_xpath('//*[text() = "This page looks better in the app"]', driver))

    def tearDown(self):
        self.driver.close()
        self.script_file.close()

if __name__ == "__main__":
    unittest.main()