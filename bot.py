from os import environ
import os
import time
from unshortenit import UnshortenIt
from urllib.parse import urlparse
import aiohttp
from pyrogram import Client, filters
from bs4 import BeautifulSoup
import requests
from pyshorteners import Shortener
import re

API_ID = environ.get('API_ID')
API_HASH = environ.get('API_HASH')
BOT_TOKEN = environ.get('BOT_TOKEN')
MDISK_TOKEN = environ.get('MDISK_TOKEN')
BITLY_KEY = environ.get('BITLY_KEY')
THUMB_URL = environ.get('THUMB_URL', 'https://telegra.ph/file/1181d9119a13988dfe29c.jpg')
CHANNEL = environ.get('CHANNEL')
bot = Client('Doodstream bot',
             api_id=API_ID,
             api_hash=API_HASH,
             bot_token=BOT_TOKEN,
             workers=50,
             sleep_threshold=0)


@bot.on_message(filters.command('start') & filters.private)
async def start(bot, message):
    await message.reply(
        f"**𝗛𝗘𝗟𝗟𝗢🎈{message.chat.first_name}!**\n\n"
        "𝐈'𝐦 𝐚 Mdisk 𝐔𝐩𝐥𝐨𝐚𝐝𝐞𝐫 𝐛𝐨𝐭. 𝐉𝐮𝐬𝐭 𝐬𝐞𝐧𝐝 𝐦𝐞 𝐥𝐢𝐧𝐤 𝐨𝐫 𝐅𝐮𝐥𝐥 𝐩𝐨𝐬𝐭... \n 𝐓𝐡𝐢𝐬 𝐛𝐨𝐭 𝐢𝐬 𝐦𝐚𝐝𝐞 𝐛𝐲 @"+ CHANNEL +"💖")


@bot.on_message(filters.text & filters.private)
async def pdisk_uploader(bot, message):
    new_string = str(message.text)
    conv = await message.reply("Converting...")
    dele = conv["message_id"]
    try:
        pdisk_link = await multi_pdisk_up(new_string)
        await bot.delete_messages(chat_id=message.chat.id, message_ids=dele)
        await message.reply(f'{pdisk_link}', quote=True)
    except Exception as e:
        await message.reply(f'Error: {e}', quote=True)


@bot.on_message(filters.photo & filters.private)
async def pdisk_uploader(bot, message):
    new_string = str(message.caption or '')
    conv = await message.reply("Converting...")
    dele = conv["message_id"]
    try:
        pdisk_link = await multi_pdisk_up(new_string)
        if(len(pdisk_link) > 1020):
            await bot.delete_messages(chat_id=message.chat.id, message_ids=dele)
            await message.reply(f'{pdisk_link}', quote=True)
        else:
            await bot.delete_messages(chat_id=message.chat.id, message_ids=dele)
            await bot.send_photo(message.chat.id, message.photo.file_id, caption=f'{pdisk_link}')
    except Exception as e:
        await message.reply(f'Error: {e}', quote=True)

async def get_dtitle(url):
    html_text = requests.get(url).text
    soup = BeautifulSoup(html_text, 'html.parser')
    for title in soup.find_all('title'):
        pass
    title = list(title.get_text())
    title = title[8:]
    str = ''
    for i in title:
        str = str + i
    str = str or ('@' + CHANNEL)

    return str

async def pdisk_up(alink):
    parsed_link = urlparse(alink)
    link = parsed_link.geturl()

    if ('bit' in link):
        #link = urlopen(link).geturl()
        unshortener = UnshortenIt()
        link = unshortener.unshorten(link)
    
    title_new = os.path.basename(parsed_link.path)
    # title_ddisk = await get_dtitle(link)
    channel_name = "@" + CHANNEL
    title_Doodstream = re.sub('/@.[a-zA-Z0-9_]*/g', channel_name, title_new)

    url = 'https://diskuploader.mypowerdisk.com/v1/tp/cp'
    param = {'token': MDISK_TOKEN,'link': link}
    res = requests.post(url, json = param)
      
    data = res.json()
    data = dict(data)
    print("mdisk data", data)
    v_url = ''
    if 'sharelink' in data:
      v_url = data['sharelink']
      # s = Shortener(api_key=BITLY_KEY)
      # v_url = s.bitly.short(v_url)
    elif 'msg' in data:
      v_url = " " + data['msg']
    else:
      v_url = ' Error'
    return (v_url)


# async def multi_pdisk_up(ml_string):
#     new_ml_string = list(map(str, ml_string.split(" ")))
#     new_ml_string = await remove_username(new_ml_string)
#     new_join_str = " ".join(new_ml_string)

#     urls = re.findall(r'(https?://[^\s]+)', new_join_str)

#     new_urls = await new_pdisk_url(urls)
#     index = 0
#     for j in urls:
#       if len(new_urls) > index:
#         new_join_str = new_join_str.replace(j, new_urls[index])
#       index += 1
 
#     return await addFooter(new_join_str)

def deEmojify(inputString):
    return inputString.encode('ascii', 'ignore').decode('ascii')

async def multi_pdisk_up(ml_string):
    list_string = ml_string.splitlines()
    ml_string = ' \n'.join(list_string)
    new_ml_string = list(map(str, ml_string.split(" ")))
    new_ml_string = await remove_username(new_ml_string)
    new_join_str = "".join(new_ml_string)
    new_join_str = deEmojify(new_join_str)

    urls = re.findall(r'(https?://[^\s]+)', new_join_str)

    nml_len = len(new_ml_string)
    u_len = len(urls)
    url_index = []
    count = 0
    for i in range(nml_len):
        for j in range(u_len):
            if (urls[j] in new_ml_string[i]):
                url_index.append(count)
        count += 1
    new_urls = await new_pdisk_url(urls)
    url_index = list(dict.fromkeys(url_index))
    i = 0
    for j in url_index:
        new_ml_string[j] = new_ml_string[j].replace(urls[i], new_urls[i])
        i += 1

    new_string = " ".join(new_ml_string)
    return await addFooter(new_string)


async def new_pdisk_url(urls):
    new_urls = []
    urls_dict = {}
    for i in urls:
        new_link = ''
        if i in urls_dict:
          new_link = urls_dict[i]
        else:
          time.sleep(0.2)
          new_link = await pdisk_up(i)
          urls_dict[i] = new_link
        new_urls.append(new_link)
    return new_urls


async def remove_username(new_List):
    index = 0
    for i in new_List:
        if('@' in i or 't.me' in i or 'https://bit.ly/3m4gabB' in i or 'https://bit.ly/pdisk_tuts' in i or 'telegra.ph' in i):
            new_List[index] = " @" + CHANNEL
        index += 1
    return new_List


async def addFooter(str):
    footer = """
━━━━━━━━━━━━━━━
⭐️JOIN CHANNEL ➡️ t.me/""" + CHANNEL
    return str

bot.run()