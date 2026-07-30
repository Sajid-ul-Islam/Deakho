import type { Channel } from '../types';

const channels: Channel[] = [
  // --- ENTERTAINMENT & MOVIES ---
  {
    id: 'sony-aath',
    name: 'Sony AATH HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Sony_Aath_logo.svg/1200px-Sony_Aath_logo.svg.png',
    group: 'Entertainment',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC5694w_Vj13A5n9T-q9244Q',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://amg01448-samsungin-enterr10bangla-samsungin-ad-gg.amagi.tv/playlist/amg01448-samsungin-enterr10bangla-samsungin/playlist.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: 'enterr10-bangla',
    name: 'Enterr10 Bangla',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/ea/Enterr10_Bangla.jpeg/200px-Enterr10_Bangla.jpeg',
    group: 'Entertainment',
    urls: [
      {
        url: 'https://amg01448-samsungin-enterr10bangla-samsungin-ad-gg.amagi.tv/playlist/amg01448-samsungin-enterr10bangla-samsungin/playlist.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'https://live-bangla.akamaized.net/liveabr/pub-iobanglakp3sff/live_720p/chunks.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: 'deshi-tv',
    name: 'Deshi TV HD',
    logo: 'https://i.postimg.cc/t4cxjxRj/Deshi-TV.jpg',
    group: 'Entertainment',
    urls: [
      {
        url: 'https://deshitv.deshitv24.net/live/myStream/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },

  // --- BANGLADESHI (GENERAL) ---
  {
    id: 'btv',
    name: 'BTV',
    logo: 'https://i.imgur.com/bXMVc8O.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'http://103.165.93.31:8095/btv/tracks-v1a1/mono.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1709/output/index.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: 'deepto-tv',
    name: 'Deepto TV HD',
    logo: 'https://i.imgur.com/tPZKfLr.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://byphdgllyk.gpcdn.net/hls/deeptotv/0_1/index.m3u8',
        label: 'Primary HD',
      },
      {
        url: 'https://byphdgllyk.gpcdn.net/hls/deeptotv/index.m3u8',
        label: 'Backup 1',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1711/output/index.m3u8',
        label: 'Backup 2',
      },
    ],
  },
  {
    id: 'ekusey-tv',
    name: 'Ekusey TV',
    logo: 'https://i.imgur.com/7qBJhWg.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://ekusheyserver.com/hls-live/livepkgr/_definst_/liveevent/livestream3.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'http://210.4.72.204/hls-live/livepkgr/_definst_/liveevent/livestream3.m3u8',
        label: 'Backup 1',
      },
      {
        url: 'https://static.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/ekusheytv-8-org.stream/playlist.m3u8?wmsAuthSign=',
        label: 'JagoBD Backup',
        needsHeaders: true,
        needsProxy: true,
      },
    ],
  },
  {
    id: 'channel-24',
    name: 'Channel 24',
    logo: 'https://tstatic.akash-go.com/cms-ui/images/custom-content/1735556516924.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCf8zW8a0lI1v1J_J1g6q2zA',
        label: 'YouTube Live',
      },
      {
        url: 'https://static.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/channel24-sg-e8e.stream/playlist.m3u8?wmsAuthSign=',
        label: 'JagoBD Stream',
        needsHeaders: true,
        needsProxy: true,
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1703/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'ekhon-tv',
    name: 'Ekhon TV HD',
    logo: 'https://i.imgur.com/wqYBj6f.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://stream.ottplus.live/live/ekhon_tv_abr/live/ekhon_tv_hd_720/chunks.m3u8',
        label: 'Primary HD',
      },
    ],
  },
  {
    id: 'ntv-bangla',
    name: 'NTV Bangla',
    logo: 'https://www.ntvbd.com/sites/default/files/aggregator/2020/02/17/ntv-channel_0.jpg',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCgC24V47t6l6091wE268k0A',
        label: 'YouTube Live',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1716/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'channel-i',
    name: 'Channel i HD',
    logo: 'https://cdn.tvpassport.com/image/station/240x135/channel-i-bangla.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCv-l7w0335eZ2k773l68V_Q',
        label: 'YouTube Live',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1723/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'ananda-tv',
    name: 'Ananda TV HD',
    logo: 'https://i.imgur.com/LwP634U.png',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://static.jagobd.com.bd/c3VydmVyX8RpbEU9Mi8xNy8yMFDEEHGcfRgzQ6NTAgdEoaeFzbF92YWxIZTO0U0ezN1IzMyfvcEdsEfeDeKiNkVN3PTOmdFseWRtaW51aiPhnPTI2/anandatv.stream/playlist.m3u8?wmsAuthSign=',
        label: 'JagoBD Stream',
        needsHeaders: true,
        needsProxy: true,
      },
    ],
  },
  {
    id: 'atn-bangla-uk',
    name: 'ATN Bangla UK',
    logo: 'https://i.ytimg.com/vi/GRCWbI5ZSFg/maxresdefault.jpg',
    group: 'Bangladeshi',
    urls: [
      {
        url: 'https://app.ncare.live/live-orgin/atnbanglauk-off.stream/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },

  // --- WORLD NEWS & INTERNATIONAL ---
  {
    id: 'al-jazeera',
    name: 'Al Jazeera English',
    logo: 'https://upload.wikimedia.org/wikipedia/en/7/77/Al_Jazeera_English_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCNye-wNBqNL5ZzHSJj3l8Bg',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://live-hls-web-aje.getaj.net/AJE/01.m3u8',
        label: 'Primary HLS Stream',
      },
    ],
  },
  {
    id: 'cnn-international',
    name: 'CNN International',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b1/CNN.svg',
    group: 'News',
    urls: [
      {
        url: 'https://cnn-cnninternational-1-de.samsung.wurl.tv/manifest/playlist.m3u8',
        label: 'Primary HLS Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCupvZG-5ko_eiXAup5yOabw',
        label: 'Official YouTube Live',
      },
    ],
  },
  {
    id: 'bbc-news',
    name: 'BBC News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/6/62/BBC_News_2019.svg',
    group: 'News',
    urls: [
      {
        url: 'https://vs-cbbc-mshow.akamaized.net/hls/live/2020293/cbbc_mshow/index.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC16niRr50-MSBwiO3YDb3RA',
        label: 'Official YouTube Live',
      },
    ],
  },
  {
    id: 'trt-world',
    name: 'TRT World HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/ea/TRT_World_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCvHM0xvyV51_T4c-V-h3R5A',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://tv-trtworld.medya.trt.com.tr/master.m3u8',
        label: 'Primary HLS Stream',
      },
    ],
  },
  {
    id: 'sky-news',
    name: 'Sky News UK',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Sky_News_2018_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UComdjvms2zOqZ1bWw37uRjA',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://sky-skynews-uk.samsung.wurl.tv/manifest/playlist.m3u8',
        label: 'Samsung HLS Stream',
      },
    ],
  },
  {
    id: 'euronews-eng',
    name: 'Euronews English',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/0/02/Euronews_2016_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCSrZ3UV4jxyidvijh6ZmcFQ',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://euronews-euronews-england-1-us.samsung.wurl.tv/manifest/playlist.m3u8',
        label: 'Primary HLS Stream',
      },
    ],
  },
  {
    id: 'france-24',
    name: 'France 24 English',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/1b/France_24_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCQfwfsi5gJ16U5M6o6-tZ_Q',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://static.france24.com/live/F24_EN_LO_HLS/live_tv.m3u8',
        label: 'Primary HLS Stream',
      },
    ],
  },
  {
    id: 'dw-news',
    name: 'DW News HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/7/75/Deutsche_Welle_symbol_2012.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCknLrEdhRCp1aogoY4XAyaA',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://dwamdstream102.akamaized.net/hls/live/2015525/dwstream102/index.m3u8',
        label: 'Akamai HLS Stream',
      },
    ],
  },
  {
    id: 'bloomberg-tv',
    name: 'Bloomberg TV HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/a/ab/Bloomberg_Television_logo.svg',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCUMZ7gOHfZkowN56576839w',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://live-out.bloomberg.com/hls/live/us/index.m3u8',
        label: 'Primary HLS Stream',
      },
    ],
  },

  // --- NEWS ---
  {
    id: 'shomoy-tv',
    name: 'Shomoy TV',
    logo: 'https://i.imgur.com/gEDwlNf.png',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC1uG2i9oO4f_y-F6z12y30g',
        label: 'YouTube Live Official',
      },
      {
        url: 'https://live.thebosstv.com:30443/dwlive/Somoy-TV/playlist.m3u8',
        label: 'Primary HLS',
      },
      {
        url: 'http://103.165.93.31:8095/somoyTv/tracks-v1a1/mono.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: 'jamuna-tv',
    name: 'Jamuna TV HD',
    logo: 'https://jamunagroup.com.bd/company-images/1662487622-mdshamimislam.png',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCd0qAqaZk93hM-B5fA0V4hA',
        label: 'YouTube Live Official',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1701/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'independent-tv',
    name: 'Independent TV',
    logo: 'https://dl.dropbox.com/s/7xwwb8hetz3w8rp/independent_tv.png',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC9924-f7bA8e3r75k1J_2gQ',
        label: 'YouTube Live Official',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1704/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'ekattor-tv',
    name: 'Ekattor TV',
    logo: 'https://s4.gifyu.com/images/imagea02f4314e761661d.png',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCJ3u_vF7l_m1Z6K9z8_j2gQ',
        label: 'YouTube Live Official',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1705/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'atn-news',
    name: 'ATN News',
    logo: 'https://dl.dropbox.com/s/4ldi1dp09s8o6bm/atn_news_bd.png',
    group: 'News',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCqR5W2N6m2-H6g403W1eY8w',
        label: 'YouTube Live Official',
      },
      {
        url: 'https://owrcovcrpy.gpcdn.net/bpk-tv/1706/output/index.m3u8',
        label: 'CDN Backup',
      },
    ],
  },
  {
    id: 'abp-ananda',
    name: 'ABP Ananda',
    logo: 'https://i.postimg.cc/662vVv5x/ABP-Ananda.jpg',
    group: 'News',
    urls: [
      {
        url: 'https://amg01448-samsungin-abpananda-samsungin-ad-pw.amagi.tv/playlist/amg01448-samsungin-abpananda-samsungin/playlist.m3u8',
        label: 'Amagi Stream',
      },
      {
        url: 'https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/abp-ananda/1e4516fa-023a-4807-8e3d-479b346b4a62/2.m3u8',
        label: 'Cloudfront Backup',
      },
    ],
  },
  {
    id: 'jagonews-24',
    name: 'Jagonews 24',
    logo: 'https://i.imgur.com/4i1iqIj.png',
    group: 'News',
    urls: [
      {
        url: 'https://app.ncare.live/live-orgin/jagonews24.stream/live-orgin/jagonews24.stream/chunks.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'news18-bangla',
    name: 'News18 Bangla',
    logo: 'https://jio.dinesh29.com.np/smart/ardinesh/logos/news18-bangla-news.png',
    group: 'News',
    urls: [
      {
        url: 'https://amg01448-samsungin-news18bangla-samsungin-ad-qy.amagi.tv/playlist/amg01448-samsungin-news18bangla-samsungin/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'zee-24-ghanta',
    name: 'Zee 24 Ghanta',
    logo: 'https://i.postimg.cc/tTNPLBMs/24-Ghanta.jpg',
    group: 'News',
    urls: [
      {
        url: 'https://d2dsoyvkr33m05.cloudfront.net/index_1.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'tv9-bangla',
    name: 'TV9 Bangla',
    logo: 'https://i.postimg.cc/tTNPLBMs/24-Ghanta.jpg',
    group: 'News',
    urls: [
      {
        url: 'https://dyjmyiv3bp2ez.cloudfront.net/pub-iotv9banaen8yq/liveabr/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'dd-bangla',
    name: 'DD Bangla',
    logo: 'https://i.postimg.cc/WzhwJYDJ/DD-Bangla.jpg',
    group: 'News',
    urls: [
      {
        url: 'https://d3eyhgoylams0m.cloudfront.net/v1/manifest/93ce20f0f52760bf38be911ff4c91ed02aa2fd92/ed7bd2c7-8d10-4051-b397-2f6b90f99acb/2e9e32a4-c4f7-49c3-96d6-c4e3660c7e3f/2.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'https://d3qs3d2rkhfqrt.cloudfront.net/out/v1/7ff57cc9046b4c188b51a0d506f36e7f/index_3.m3u8',
        label: 'Backup Stream',
      },
    ],
  },

  // --- SPORTS ---
  {
    id: 't-sports',
    name: 'T Sports HD',
    logo: 'https://i.imgur.com/CJUmEHD.png',
    group: 'Sports',
    urls: [
      {
        url: 'http://103.165.93.31:8095/tsports/tracks-v1a1a2/mono.m3u8',
        label: 'Primary HD',
      },
      {
        url: 'https://s1.itcnbd.live/T-Sports-HD/tracks-v1a1/mono.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: 'craze-tv',
    name: 'CrazeTV Sports',
    logo: 'https://raw.githubusercontent.com/imShakil/tvlink/refs/heads/main/dekho-prime-icon-192.webp',
    group: 'Sports',
    urls: [
      {
        url: 'https://dfr80qz435crc.cloudfront.net/MNOP/Amagi/Caze/Caze_TV_BR/Caze_TV.m3u8',
        label: 'Primary Stream',
      },
    ],
  },

  // --- MUSIC ---
  {
    id: '9xm',
    name: '9XM Music',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/2/29/9x_media.png',
    group: 'Music',
    urls: [
      {
        url: 'https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/9xm/a731c680-6a62-4174-bc98-186fe654724a/0.m3u8',
        label: 'Primary Stream',
      },
      {
        url: 'https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/9xm/9f1a3d57-4134-4f4c-95ea-2cb142ac63f8/0.m3u8',
        label: 'Backup Stream',
      },
    ],
  },
  {
    id: '9x-jalwa',
    name: '9X Jalwa',
    logo: 'https://static.wikia.nocookie.net/logopedia/images/2/21/9x_Jalwa.png',
    group: 'Music',
    urls: [
      {
        url: 'https://d35j504z0x2vu2.cloudfront.net/v1/manifest/0bc8e8376bd8417a1b6761138aa41c26c7309312/9x-jalwa/47bdb49d-f6f3-4927-a9ea-12c4c5afc732/0.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'b4u-music',
    name: 'B4U Music',
    logo: 'https://i.postimg.cc/rmBYB7GQ/Bhojpuri-Cinema.jpg',
    group: 'Music',
    urls: [
      {
        url: 'https://d3kdywbtdfbp9z.cloudfront.net/v1/manifest/93ce20f0f52760bf38be911ff4c91ed02aa2fd92/dff423e0-3c82-46d6-9ecb-3baa96b5694a/4598c408-0e38-488c-9b64-fc845d1ea2b6/0.m3u8',
        label: 'Primary Stream',
      },
    ],
  },

  // --- KIDS & CARTOONS ---
  {
    id: 'cartoon-network',
    name: 'Cartoon Network HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/8/80/Cartoon_Network_2010_logo.svg',
    group: 'Kids',
    urls: [
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCU0rIMU3k_AsVA8d6N1B03w',
        label: 'Official YouTube Live',
      },
      {
        url: 'https://d2lmgfyblo9rak.cloudfront.net/playlist.m3u8',
        label: 'Backup HLS Stream',
      },
    ],
  },
  {
    id: 'tom-and-jerry',
    name: 'Tom & Jerry 24/7',
    logo: 'https://upload.wikimedia.org/wikipedia/en/5/5f/Tom_and_Jerry_Logo.svg',
    group: 'Kids',
    urls: [
      {
        url: 'https://www.youtube.com/embed/videoseries?list=PL0gO_C-a69Z2w0vYp0F64d2gE0gZ9999',
        label: '24/7 Classics Stream',
      },
    ],
  },
  {
    id: 'duronto-tv',
    name: 'Duronto TV Kids',
    logo: 'https://upload.wikimedia.org/wikipedia/en/d/d7/Duronto_TV_Logo.png',
    group: 'Kids',
    urls: [
      {
        url: 'http://foxkids-online.ru/hls/test_240p264kbs/index.m3u8',
        label: 'Primary Kids Stream',
      },
    ],
  },
  {
    id: 'boomerang-tv',
    name: 'Boomerang Cartoons',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/1/15/Boomerang_2014_logo.svg',
    group: 'Kids',
    urls: [
      {
        url: 'https://d2lmgfyblo9rak.cloudfront.net/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'disney-junior',
    name: 'Disney Junior',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/e/eb/Disney_Junior_2020_logo.svg',
    group: 'Kids',
    urls: [
      {
        url: 'https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'duck-tv',
    name: 'Duck TV',
    logo: 'https://i.postimg.cc/zBCLNtGZ/Duronto.jpg',
    group: 'Kids',
    urls: [
      {
        url: 'https://d2lmgfyblo9rak.cloudfront.net/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'jungle-book',
    name: 'Jungle Book TV',
    logo: 'https://i.imgur.com/ubZMeQv.jpg',
    group: 'Kids',
    urls: [
      {
        url: 'https://cc-4bhi5osabejc9.akamaized.net/v1/master/3722c60a815c199d9c0ef36c5b73da68a62b09d1/cc-4bhi5osabejc9/junglebook.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'pbs-kids',
    name: 'PBS Kids',
    logo: 'https://i.imgur.com/ubZMeQv.jpg',
    group: 'Kids',
    urls: [
      {
        url: 'https://2-fss-2.streamhoster.com/pl_140/amlst:200914-1298290/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'rongeen-tv',
    name: 'Rongeen TV',
    logo: 'https://i.postimg.cc/zBCLNtGZ/Duronto.jpg',
    group: 'Kids',
    urls: [
      {
        url: 'https://server.thelegitpro.in/rongeentv/rongeentv/tracks-v1a1/mono.m3u8',
        label: 'Primary Stream',
      },
    ],
  },

  // --- RELIGIOUS ---
  {
    id: 'saudi-quran',
    name: 'Saudi Quran Live',
    logo: 'https://yt3.ggpht.com/ytc/AMLnZu_Gxy8ywjMY6_YPX-1uYtUGA56FOfDoBsH62-ekNA=s900-c-k-c0x00ffffff-no-rj',
    group: 'Religious',
    urls: [
      {
        url: 'https://cdn-globecast.akamaized.net/live/eds/saudi_quran/hls_roku/index.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'madina-live',
    name: 'Madina Sunnah Live',
    logo: 'https://images-na.ssl-images-amazon.com/images/I/71CywdrFaZL.png',
    group: 'Religious',
    urls: [
      {
        url: 'https://cdn-globecast.akamaized.net/live/eds/saudi_sunnah/hls_roku/index.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'peace-tv-bangla',
    name: 'Peace TV Bangla HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e0/Peace_TV_Bangla_Logo.png/220px-Peace_TV_Bangla_Logo.png',
    group: 'Religious',
    urls: [
      {
        url: 'https://peacetv.directfwd.com/peacetv/peacetv_bangla.m3u8',
        label: 'Primary HD Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC8x5b0Q5a72U2-vP009c91A',
        label: 'YouTube Live Stream',
      },
    ],
  },
  {
    id: 'peace-tv-english',
    name: 'Peace TV English HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Peace_TV_Logo.png/220px-Peace_TV_Logo.png',
    group: 'Religious',
    urls: [
      {
        url: 'https://peacetv.directfwd.com/peacetv/peacetv_english.m3u8',
        label: 'Primary HD Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCqR5W2N6m2-H6g403W1eY8w',
        label: 'YouTube Live Stream',
      },
    ],
  },
  {
    id: 'peace-tv-urdu',
    name: 'Peace TV Urdu HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/e/e2/Peace_TV_Urdu_logo.png/220px-Peace_TV_Urdu_logo.png',
    group: 'Religious',
    urls: [
      {
        url: 'https://peacetv.directfwd.com/peacetv/peacetv_urdu.m3u8',
        label: 'Primary HD Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UCJ3u_vF7l_m1Z6K9z8_j2gQ',
        label: 'YouTube Live Stream',
      },
    ],
  },
  {
    id: 'peace-tv-chinese',
    name: 'Peace TV Chinese HD',
    logo: 'https://upload.wikimedia.org/wikipedia/en/thumb/1/15/Peace_TV_Logo.png/220px-Peace_TV_Logo.png',
    group: 'Religious',
    urls: [
      {
        url: 'https://peacetv.directfwd.com/peacetv/peacetv_chinese.m3u8',
        label: 'Primary HD Stream',
      },
      {
        url: 'https://www.youtube.com/embed/live_stream?channel=UC7x5b0Q5a72U2-vP009c91A',
        label: 'YouTube Live Stream',
      },
    ],
  },

  // --- DOCUMENTARY ---
  {
    id: 'wild-earth',
    name: 'WildEarth HD',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Animal_Planet_logo.svg/1280px-Animal_Planet_logo.svg.png',
    group: 'Documentary',
    urls: [
      {
        url: 'https://wildearth-plex.amagi.tv/master.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'love-nature',
    name: 'Love Nature',
    logo: 'https://upload.wikimedia.org/wikipedia/en/1/1d/Love_Nature_TV.png',
    group: 'Documentary',
    urls: [
      {
        url: 'https://cdn1.logichost.in/ajmantv/live/playlist.m3u8',
        label: 'Primary Stream',
      },
    ],
  },
  {
    id: 'accuweather',
    name: 'AccuWeather TV',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/5/5d/AccuWeather_2021.svg',
    group: 'Documentary',
    urls: [
      {
        url: 'https://cdn-ue1-prod.tsv2.amagi.tv/linear/amg00684-accuweather-accuweather-plex/playlist.m3u8?v=1',
        label: 'Primary Stream',
      },
    ],
  },
  // --- 18+ ADULT ---
  {
    id: 'midnight-exotic',
    name: 'Midnight Exotic 18+',
    logo: 'https://i.postimg.cc/t4cxjxRj/Deshi-TV.jpg',
    group: '18+ Adult',
    isAdult: true,
    urls: [
      {
        url: 'https://cdn1.logichost.in/ajmantv/live/playlist.m3u8',
        label: 'Primary Stream (18+ Alert Active)',
      },
    ],
  },
  {
    id: 'desire-tv',
    name: 'Desire TV 18+',
    logo: 'https://i.imgur.com/LwP634U.png',
    group: '18+ Adult',
    isAdult: true,
    urls: [
      {
        url: 'https://deshitv.deshitv24.net/live/myStream/playlist.m3u8',
        label: 'Primary Stream (18+ Alert Active)',
      },
    ],
  },
  {
    id: 'velvet-night',
    name: 'Velvet Night 18+',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Enterr10_Bangla.jpeg/200px-Enterr10_Bangla.jpeg',
    group: '18+ Adult',
    isAdult: true,
    urls: [
      {
        url: 'https://amg01448-samsungin-enterr10bangla-samsungin-ad-gg.amagi.tv/playlist/amg01448-samsungin-enterr10bangla-samsungin/playlist.m3u8',
        label: 'Primary Stream (18+ Alert Active)',
      },
    ],
  },
];

export default channels;

export const groups = [
  'All',
  'Favorites',
  'Bangladeshi',
  'News',
  'Sports',
  'Entertainment',
  'Music',
  'Kids',
  'Documentary',
  'Religious',
  'Custom',
  '18+ Adult',
] as const;

export type Group = (typeof groups)[number];
