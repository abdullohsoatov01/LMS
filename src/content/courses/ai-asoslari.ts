import type { Course } from "../types";

export const aiBasics: Course = {
  id: "ai-asoslari",
  title: "Sun'iy intellekt nima?",
  emoji: "🤖",
  description: "Neyron tarmoqlar, ChatGPT va Claude qanday ishlashini bilib ol va o'zing kichik «model» yasa.",
  gradient: "from-violet-500 to-fuchsia-500",
  badge: { name: "AI kashfiyotchisi", emoji: "🛸" },
  lessons: [
    {
      id: "ai-atrofimizda",
      title: "AI atrofimizda",
      emoji: "🌍",
      description: "Sun'iy intellekt nima va u har kuni qayerda uchraydi",
      steps: [
        {
          type: "text",
          emoji: "👋",
          title: "Salom! Men Robo",
          body: `Men senga **sun'iy intellekt** (inglizcha *Artificial Intelligence*, qisqasi **AI**) haqida hamma narsani o'rgataman.

**Sun'iy intellekt** — bu kompyuterga odatda inson aqli talab qiladigan ishlarni bajarishni o'rgatadigan texnologiya:

- 👀 ko'rish va tanish
- 👂 eshitish va tushunish
- 💬 gapirish va yozish
- 🤔 qaror qabul qilish`,
        },
        {
          type: "text",
          emoji: "📱",
          title: "Sen AI dan har kuni foydalanasan",
          body: `Balki sezmagandirsan, lekin AI allaqachon atrofingda:

- **Face ID** — telefon yuzingni tanib, qulfni ochadi
- **YouTube va TikTok** — aynan senga yoqadigan videolarni tavsiya qiladi
- **Google Tarjimon** — matnni bir tildan boshqasiga o'giradi
- **Navigator** — tirbandlikni oldindan bashorat qiladi
- **ChatGPT, Claude** — savollaringga javob beradi, matn yozadi`,
        },
        {
          type: "quiz",
          question: "Sun'iy intellekt — bu...",
          options: [
            "Robotlarning yangi turi",
            "Kompyuterga insonga xos vazifalarni bajarishni o'rgatadigan texnologiya",
            "Internet tezligini oshiradigan dastur",
            "Faqat filmlarda bo'ladigan narsa",
          ],
          correct: 1,
          explanation: "AI — bu texnologiya. U robotda ham, telefonda ham, saytda ham ishlashi mumkin.",
        },
        {
          type: "classify",
          question: "Bu yerda AI ishlayaptimi?",
          buckets: [
            { id: "ai", label: "AI bor", emoji: "🤖" },
            { id: "no", label: "AI yo'q", emoji: "🔧" },
          ],
          items: [
            { text: "TikTok senga yangi video tavsiya qiladi", bucket: "ai" },
            { text: "Kalkulyator 2 + 2 ni hisoblaydi", bucket: "no" },
            { text: "Telefon yuzingni tanib, qulfni ochadi", bucket: "ai" },
            { text: "Kalitni bossang, chiroq yonadi", bucket: "no" },
            { text: "Google Tarjimon matnni tarjima qiladi", bucket: "ai" },
            { text: "Budilnik soat 7:00 da jiringlaydi", bucket: "no" },
            { text: "Pochta spam xatlarni o'zi ajratadi", bucket: "ai" },
          ],
          explanation: "Kalkulyator va budilnik oddiy qoidalar bilan ishlaydi. AI esa misollardan o'rganib, o'zi qaror qiladi.",
        },
        {
          type: "text",
          emoji: "💡",
          title: "Eng muhim farq",
          body: `**Oddiy dastur** qoidalar asosida ishlaydi: dasturchi «agar ... bo'lsa, ... qil» deb hamma narsani qo'lda yozib qo'yadi.

**AI esa misollardan o'rganadi.** Kalkulyatorga hech kim misol ko'rsatmagan — unga qoidalar yozilgan. Face ID esa millionlab yuz rasmlarini ko'rib, yuzlarni tanishni *o'zi* o'rgangan.

> Yuzni tanish qoidalarini qo'lda yozib bo'lmaydi — ular juda ko'p! Shuning uchun AI kerak.`,
        },
        {
          type: "quiz",
          question: "Oddiy dastur va AI ning asosiy farqi nima?",
          options: [
            "AI har doim to'g'ri ishlaydi",
            "Oddiy dastur internetsiz ishlamaydi",
            "AI misollardan o'rganadi, oddiy dasturga esa qoidalar qo'lda yoziladi",
            "Hech qanday farqi yo'q",
          ],
          correct: 2,
        },
        {
          type: "quiz",
          question: "Qaysi biri AI ga misol EMAS?",
          options: [
            "Ovozli yordamchi (Siri, Alisa)",
            "Shaxmat o'ynaydigan bot",
            "Oddiy oshxona taymeri",
            "Rasmdagi mushukni taniydigan ilova",
          ],
          correct: 2,
          explanation: "Taymer shunchaki vaqtni sanaydi — u hech narsani o'rganmaydi.",
        },
      ],
    },
    {
      id: "mashina-organishi",
      title: "Mashina qanday o'rganadi?",
      emoji: "🧠",
      description: "Ma'lumotlar, o'qitish va birinchi «model»",
      steps: [
        {
          type: "text",
          emoji: "🐱",
          title: "Bolaga mushukni qanday o'rgatasan?",
          body: `Kichkina ukangga «mushuk nima?» deb qoidalar ro'yxatini o'qib bermaysan. Sen unga **ko'p mushuklarni ko'rsatasan**: «mana bu mushuk, bu ham mushuk, bu esa it».

Kompyuter ham xuddi shunday o'rganadi! Bu **mashinali o'rganish** (*Machine Learning*) deyiladi:

**Ma'lumotlar + misollar → o'qitish → model**

**Model** — bu o'qitish natijasida paydo bo'lgan «miya». U endi yangi, avval ko'rmagan rasmlarni ham taniy oladi.`,
        },
        {
          type: "text",
          emoji: "🪜",
          title: "O'qitish bosqichlari",
          body: `1. **Ma'lumot yig'ish** — minglab rasmlar, matnlar yoki raqamlar
2. **Belgilash** — har bir misolga javob yoziladi: «bu mushuk», «bu it»
3. **O'qitish** — model misollardagi naqshlarni (qonuniyatlarni) qidiradi
4. **Tekshirish** — model avval ko'rmagan yangi misollarda sinab ko'riladi
5. **Ishlatish** — model ilovaga qo'yiladi va odamlarga yordam beradi`,
        },
        {
          type: "order",
          question: "Mashinani o'qitish bosqichlarini to'g'ri tartibda joylashtir",
          items: [
            "Ma'lumot yig'ish (minglab rasmlar)",
            "Rasmlarni belgilash: «bu mushuk», «bu it»",
            "Modelni o'qitish",
            "Yangi rasmlarda tekshirish",
            "Ilovada ishlatish",
          ],
        },
        {
          type: "quiz",
          question: "Model mushuklarni tanishni o'rganishi uchun eng ko'p nima kerak?",
          options: [
            "Kuchli monitor",
            "Ko'plab belgilangan mushuk rasmlari",
            "Mushuk haqida she'r",
            "Tez internet",
          ],
          correct: 1,
        },
        {
          type: "text",
          emoji: "🗑️",
          title: "«Axlat kirsa — axlat chiqadi»",
          body: `Model faqat ko'rsatilgan narsani o'rganadi. Agar ma'lumotlar yomon bo'lsa, model ham yomon bo'ladi.

> **Haqiqiy voqea:** olimlar modelni it va bo'rilarni ajratishga o'rgatishdi. Bo'rilarning deyarli hamma rasmi qorda olingan edi. Natijada model hayvonga emas, **qorga** qarashni o'rgandi: qorda turgan itni ham «bo'ri» deb aytdi!`,
        },
        {
          type: "quiz",
          question: "Model faqat oq mushuklar rasmlarida o'qitildi. Unga qora mushuk ko'rsatilsa, nima bo'lishi mumkin?",
          options: [
            "Albatta taniydi — mushuk baribir mushuk",
            "Uni mushuk deb tanimasligi mumkin",
            "Model buziladi va o'chib qoladi",
            "Qora mushukni oq rangda ko'radi",
          ],
          correct: 1,
          explanation: "Model qora mushukni hech qachon ko'rmagan. Shuning uchun ma'lumotlar xilma-xil bo'lishi juda muhim.",
        },
        {
          type: "code",
          title: "Birinchi modelingni yasa!",
          task: `Bizda mevalarning og'irligi bor. Model **olma** va **tarvuzni** og'irligiga qarab ajratishni o'rganishi kerak.

Model ma'lumotlardan **chegara** topadi: chegaradan yengil bo'lsa — olma, og'ir bo'lsa — tarvuz.

👉 \`___\` o'rniga chegara formulasini yoz: u **ikkala o'rtachaning o'rtasi** bo'lishi kerak. Keyin **▶ Ishga tushirish** tugmasini bos.`,
          starter: String.raw`# Ma'lumotlar: mevalarning og'irligi (grammda)
olmalar = [150, 180, 120, 200, 170]
tarvuzlar = [3000, 4500, 2500, 5000, 4000]

# 1-qadam: o'rtacha og'irlikni hisoblaymiz
olma_ortacha = sum(olmalar) / len(olmalar)
tarvuz_ortacha = sum(tarvuzlar) / len(tarvuzlar)

# 2-qadam: chegara — ikki o'rtachaning o'rtasi
chegara = ___

def tani(ogirlik):
    if ogirlik < chegara:
        return "olma"
    else:
        return "tarvuz"

print("Chegara:", chegara)
print("160 gramm —", tani(160))
print("3500 gramm —", tani(3500))
`,
          tests: String.raw`assert abs(chegara - (olma_ortacha + tarvuz_ortacha) / 2) < 0.01, "Chegara ikki o'rtachaning o'rtasi bo'lishi kerak"
assert tani(160) == "olma", "160 gramm olma bo'lishi kerak"
assert tani(3500) == "tarvuz", "3500 gramm tarvuz bo'lishi kerak"
`,
          solution: String.raw`# Ma'lumotlar: mevalarning og'irligi (grammda)
olmalar = [150, 180, 120, 200, 170]
tarvuzlar = [3000, 4500, 2500, 5000, 4000]

# 1-qadam: o'rtacha og'irlikni hisoblaymiz
olma_ortacha = sum(olmalar) / len(olmalar)
tarvuz_ortacha = sum(tarvuzlar) / len(tarvuzlar)

# 2-qadam: chegara — ikki o'rtachaning o'rtasi
chegara = (olma_ortacha + tarvuz_ortacha) / 2

def tani(ogirlik):
    if ogirlik < chegara:
        return "olma"
    else:
        return "tarvuz"

print("Chegara:", chegara)
print("160 gramm —", tani(160))
print("3500 gramm —", tani(3500))
`,
          hint: "Ikki sonning o'rtasini topish uchun ularni qo'shib, 2 ga bo'l: (a + b) / 2",
        },
        {
          type: "text",
          emoji: "🎉",
          title: "Sen haqiqiy model yasading!",
          body: `Chegarani **sen o'zing tanlamading** — uni dastur ma'lumotlardan hisobladi. Bu mashinali o'rganishning eng oddiy ko'rinishi.

Agar ertaga yangi mevalar qo'shilsa, chegara o'zi yangilanadi. Haqiqiy AI ham shunday ishlaydi, faqat ming va million marta murakkabroq.`,
        },
      ],
    },
    {
      id: "neyron-tarmoqlar",
      title: "Neyron tarmoqlar",
      emoji: "🕸️",
      description: "Sun'iy neyron qanday «o'ylaydi»",
      steps: [
        {
          type: "text",
          emoji: "🧬",
          title: "Miyadan ilhomlangan",
          body: `Sening miyangda taxminan **86 milliard neyron** bor. Ular bir-biriga signal uzatib, fikrlashga yordam beradi.

Olimlar shu g'oyadan ilhomlanib, **sun'iy neyron** o'ylab topishdi. U juda oddiy ishlaydi:

1. Bir nechta **kirish** oladi (raqamlar)
2. Har bir kirishni uning **vazniga** (muhimligiga) ko'paytiradi
3. Hammasini **qo'shadi**
4. Yig'indi **chegaradan** katta bo'lsa — «ha» (1), aks holda — «yo'q» (0)`,
        },
        {
          type: "text",
          emoji: "⚽",
          title: "Misol: sayrga chiqamanmi?",
          body: `Neyron qaror qiladi: bugun do'stlar bilan futbolga chiqamanmi?

| Kirish | Qiymati | Vazni |
|---|---|---|
| Havo quyoshli | 1 yoki 0 | **+2** |
| Do'stlar boradi | 1 yoki 0 | **+3** |
| Uy vazifasi bor | 1 yoki 0 | **−4** |

Agar yig'indi **2 dan katta** bo'lsa — chiqaman!

Masalan, quyoshli (1), do'stlar boradi (1), uy vazifasi yo'q (0):
**1×2 + 1×3 + 0×(−4) = 5** → 5 > 2 → **Chiqaman!** ⚽`,
        },
        {
          type: "quiz",
          question: "Havo quyoshli (1), do'stlar boradi (1), lekin uy vazifasi ham bor (1). Neyron nima deydi?",
          options: ["Chiqaman (yig'indi 5)", "Uyda qolaman (yig'indi 1)", "Chiqaman (yig'indi 9)", "Uyda qolaman (yig'indi −4)"],
          correct: 1,
          explanation: "1×2 + 1×3 + 1×(−4) = 1. Bu 2 dan katta emas, shuning uchun neyron «yo'q» deydi. Uy vazifasining vazni katta!",
        },
        {
          type: "order",
          question: "Neyron qanday ishlaydi? Qadamlarni tartibla",
          items: [
            "Kirish ma'lumotlarini oladi",
            "Har bir kirishni vazniga ko'paytiradi",
            "Hammasini qo'shadi",
            "Yig'indini chegara bilan solishtiradi",
            "Javob beradi: 1 yoki 0",
          ],
        },
        {
          type: "code",
          title: "O'z neyroningni yoz",
          task: `Quyidagi funksiya — haqiqiy sun'iy neyron! Unga faqat bitta qator yetishmaydi.

👉 \`___\` o'rniga har bir kirishni o'z vazniga ko'paytirish ifodasini yoz.

Maslahat: \`kirishlar[i]\` — i-kirish, \`vaznlar[i]\` — uning vazni.`,
          starter: String.raw`def neyron(kirishlar, vaznlar, chegara):
    yigindi = 0
    for i in range(len(kirishlar)):
        # har bir kirishni o'z vazniga ko'paytirib, yig'indiga qo'sh
        yigindi = yigindi + ___
    if yigindi > chegara:
        return 1
    return 0

# vaznlar: quyosh, do'stlar, uy vazifasi
vaznlar = [2, 3, -4]

print("Quyoshli, do'stlar bor, vazifa yo'q:", neyron([1, 1, 0], vaznlar, 2))
print("Quyoshli, do'stlar bor, vazifa bor:", neyron([1, 1, 1], vaznlar, 2))
`,
          tests: String.raw`assert neyron([1, 1, 0], [2, 3, -4], 2) == 1, "neyron([1, 1, 0], ...) 1 qaytarishi kerak"
assert neyron([1, 1, 1], [2, 3, -4], 2) == 0, "neyron([1, 1, 1], ...) 0 qaytarishi kerak"
assert neyron([1, 0, 1], [5, 1, 1], 5) == 1, "Boshqa vaznlar bilan ham to'g'ri ishlashi kerak"
assert neyron([0, 0, 0], [1, 1, 1], 0) == 0, "Hamma kirish 0 bo'lsa, javob 0 bo'lishi kerak"
`,
          solution: String.raw`def neyron(kirishlar, vaznlar, chegara):
    yigindi = 0
    for i in range(len(kirishlar)):
        # har bir kirishni o'z vazniga ko'paytirib, yig'indiga qo'sh
        yigindi = yigindi + kirishlar[i] * vaznlar[i]
    if yigindi > chegara:
        return 1
    return 0

# vaznlar: quyosh, do'stlar, uy vazifasi
vaznlar = [2, 3, -4]

print("Quyoshli, do'stlar bor, vazifa yo'q:", neyron([1, 1, 0], vaznlar, 2))
print("Quyoshli, do'stlar bor, vazifa bor:", neyron([1, 1, 1], vaznlar, 2))
`,
          hint: "Pythonda ko'paytirish belgisi — * (yulduzcha). Masalan: kirishlar[i] * vaznlar[i]",
        },
        {
          type: "text",
          emoji: "🏗️",
          title: "Neyronlardan — tarmoqqa",
          body: `Bitta neyron juda sodda. Lekin minglab neyronlarni **qatlam-qatlam** qilib ulasang, **neyron tarmoq** hosil bo'ladi. U rasmlarni taniy oladi, gapira oladi, hatto rasm chiza oladi!

**O'qitish** paytida tarmoq vaznlarni avtomatik ravishda o'zgartiradi: xato qilsa — vaznlarni biroz tuzatadi, yana urinadi, yana tuzatadi... millionlab marta.

> ChatGPT va Claude kabi modellarda **yuzlab milliard** vazn bor. Ularni *parametrlar* deyishadi.`,
        },
        {
          type: "quiz",
          question: "Neyron tarmoq o'qitilganda aslida nima o'zgaradi?",
          options: ["Kompyuter ekrani", "Kirish ma'lumotlari", "Vaznlar", "Dasturlash tili"],
          correct: 2,
          explanation: "O'qitish — bu to'g'ri vaznlarni topish jarayoni.",
        },
      ],
    },
    {
      id: "til-modellari",
      title: "ChatGPT va Claude qanday ishlaydi?",
      emoji: "💬",
      description: "Tokenlar va keyingi so'zni bashorat qilish",
      steps: [
        {
          type: "text",
          emoji: "📖",
          title: "Katta til modellari",
          body: `ChatGPT, Claude, Gemini — bular **katta til modellari** (inglizcha *Large Language Model*, qisqasi **LLM**).

Ular internetdagi, kitoblardagi va maqolalardagi juda katta hajmdagi matnlarni «o'qib» o'qitilgan.

Ularning asosiy mahorati juda oddiy eshitiladi:

> **Matnda keyingi so'z qaysi bo'lishini bashorat qilish.**`,
        },
        {
          type: "quiz",
          question: "«Bugun havo juda ...» — keyingi so'z qaysi bo'lishi ehtimoli eng yuqori?",
          options: ["mashina", "issiq", "yugurdi", "kitobning"],
          correct: 1,
          explanation: "Sen hozir til modeli kabi ishlading! Model ham millionlab matnlardan qaysi so'z ko'proq mos kelishini biladi.",
        },
        {
          type: "text",
          emoji: "🧩",
          title: "Tokenlar",
          body: `Model matnni harflab ham, butun gaplab ham emas, balki **tokenlar** — so'zlar yoki so'z bo'laklari bilan ko'radi.

Masalan, «o'qituvchilarimiz» so'zi bir nechta tokenga bo'linishi mumkin: «o'qituv» + «chi» + «lar» + «imiz».

Model javobni **token-token** qilib yozadi: bitta token qo'shadi, keyin yana keyingisini bashorat qiladi, va hokazo. Shuning uchun javob ekranda asta-sekin paydo bo'ladi!`,
        },
        {
          type: "code",
          title: "Matnni tokenlarga ajrat",
          task: `Keling, eng sodda «tokenizator» yasaymiz: matnni so'zlarga ajratamiz.

Pythonda matnni bo'shliqlar bo'yicha ajratadigan metod bor — \`split\`.

👉 \`___\` o'rniga metod nomini yoz.`,
          starter: String.raw`matn = "Sun'iy intellekt keyingi so'zni bashorat qiladi"

# Matnni so'zlarga (sodda «tokenlar»ga) ajratamiz
tokenlar = matn.___()

print(tokenlar)
print("Tokenlar soni:", len(tokenlar))
`,
          tests: String.raw`assert tokenlar == matn.split(), "tokenlar = matn.split() bo'lishi kerak"
assert len(tokenlar) == 6, "6 ta token chiqishi kerak"
`,
          solution: String.raw`matn = "Sun'iy intellekt keyingi so'zni bashorat qiladi"

# Matnni so'zlarga (sodda «tokenlar»ga) ajratamiz
tokenlar = matn.split()

print(tokenlar)
print("Tokenlar soni:", len(tokenlar))
`,
          hint: "Ingliz tilida «ajratmoq» — split",
        },
        {
          type: "code",
          title: "Mini til modeli",
          task: `Tasavvur qil: model millionlab matnlarni o'qib, «men» so'zidan keyin qaysi so'z necha marta kelganini sanab chiqdi.

Endi u **eng ko'p uchragan** so'zni tanlashi kerak. Dastur barcha so'zlarni aylanib chiqadi va hozirgacha eng kattasini eslab qoladi.

👉 \`___\` o'rniga nima bilan solishtirish kerakligini yoz.`,
          starter: String.raw`# «men ...» dan keyin kelgan so'zlar va ular necha marta uchragani
keyingi_sozlar = {"maktabga": 12, "kitob": 5, "futbol": 8, "uxlayman": 3}

eng_yaxshi = ""
eng_kop = 0

for soz, son in keyingi_sozlar.items():
    # agar bu so'z hozirgi rekorddan ko'p uchragan bo'lsa
    if son > ___:
        eng_kop = son
        eng_yaxshi = soz

print("Model bashorati: men", eng_yaxshi)
`,
          tests: String.raw`assert eng_yaxshi == "maktabga", "Eng ko'p uchragan so'z — «maktabga» (12 marta)"
assert eng_kop == 12, "eng_kop 12 ga teng bo'lishi kerak"
`,
          solution: String.raw`# «men ...» dan keyin kelgan so'zlar va ular necha marta uchragani
keyingi_sozlar = {"maktabga": 12, "kitob": 5, "futbol": 8, "uxlayman": 3}

eng_yaxshi = ""
eng_kop = 0

for soz, son in keyingi_sozlar.items():
    # agar bu so'z hozirgi rekorddan ko'p uchragan bo'lsa
    if son > eng_kop:
        eng_kop = son
        eng_yaxshi = soz

print("Model bashorati: men", eng_yaxshi)
`,
          hint: "Hozirgi rekord qaysi o'zgaruvchida saqlanyapti? Uning nomi «eng_...» bilan boshlanadi va son saqlaydi.",
        },
        {
          type: "quiz",
          question: "Til modeli javob yozayotganda aslida nima qiladi?",
          options: [
            "Internetdan tayyor javobni ko'chiradi",
            "Uning ortida odam operator yozib o'tiradi",
            "Har safar keyingi eng mos tokenni tanlaydi",
            "Barcha javoblarni oldindan yodlab olgan",
          ],
          correct: 2,
        },
        {
          type: "text",
          emoji: "🤔",
          title: "Bundan nima kelib chiqadi?",
          body: `Model **«eng ehtimolli»** matnni yozadi — lekin «ehtimolli» har doim ham «to'g'ri» degani emas.

Shuning uchun AI ba'zan juda ishonchli ohangda **xato** gapirishi mumkin. Keyingi darsda aynan shu haqda gaplashamiz!`,
        },
      ],
    },
    {
      id: "ai-xatolari",
      title: "AI ham xato qiladi",
      emoji: "⚠️",
      description: "Gallyutsinatsiya va tarafkashlik",
      steps: [
        {
          type: "text",
          emoji: "🌀",
          title: "Gallyutsinatsiya",
          body: `**Gallyutsinatsiya** — AI ishonch bilan mavjud bo'lmagan ma'lumotni «o'ylab topishi».

Masalan, AI:
- hech qachon yozilmagan kitobni tavsiya qilishi
- tarixiy voqeaga noto'g'ri sana aytishi
- mavjud bo'lmagan saytga havola berishi mumkin

Va bularning hammasini **juda ishonchli ohangda** aytadi!`,
        },
        {
          type: "quiz",
          question: "AI senga mavjud bo'lmagan kitobni ishonch bilan tavsiya qildi. Bu nima deyiladi?",
          options: ["Virus", "Reklama", "Gallyutsinatsiya", "Tarjima xatosi"],
          correct: 2,
        },
        {
          type: "text",
          emoji: "⚖️",
          title: "Tarafkashlik (bias)",
          body: `AI ma'lumotlardan o'rganadi. Agar ma'lumotlarda adolatsizlik bo'lsa, AI uni **takrorlaydi** va hatto kuchaytiradi.

> **Misol:** agar model asosan erkak shifokorlar rasmlarida o'qitilgan bo'lsa, «shifokor chiz» deganda deyarli doim erkak chizadi — garchi ayol shifokorlar ham juda ko'p bo'lsa-da.

Bu **tarafkashlik** (inglizcha *bias*) deyiladi.`,
        },
        {
          type: "classify",
          question: "Bu qaysi muammo?",
          buckets: [
            { id: "hal", label: "Gallyutsinatsiya", emoji: "🌀" },
            { id: "bias", label: "Tarafkashlik", emoji: "⚖️" },
          ],
          items: [
            { text: "AI tarixiy voqeaga noto'g'ri sanani o'ylab topdi", bucket: "hal" },
            { text: "Rasm chizuvchi AI «olim» deganda faqat erkaklarni chizadi", bucket: "bias" },
            { text: "Chatbot mavjud bo'lmagan ilmiy maqolaga havola berdi", bucket: "hal" },
            { text: "Ishga qabul qiluvchi AI bir guruh nomzodlarni doim pastroq baholaydi", bucket: "bias" },
            { text: "AI matematik masalaga ishonch bilan noto'g'ri javob berdi", bucket: "hal" },
          ],
        },
        {
          type: "text",
          emoji: "🕵️",
          title: "O'zingni qanday himoya qilasan?",
          body: `- 📚 Muhim faktlarni **ishonchli manbalarda** tekshir (darslik, rasmiy saytlar)
- 🔗 AI dan manba so'ra — va u manba **haqiqatan mavjudligini** tekshir
- 🙋 Shubha bo'lsa — o'qituvchidan so'ra
- 🧠 Eng muhimi: **o'z boshing bilan o'yla**. AI — yordamchi, haqiqat hakami emas.`,
        },
        {
          type: "quiz",
          question: "AI javobini tekshirishning to'g'ri usullarini tanla (bir nechta javob)",
          options: [
            "Ishonchli manbalar bilan solishtirish",
            "AI ishonch bilan gapirsa — demak to'g'ri",
            "O'qituvchi yoki mutaxassisdan so'rash",
            "AI bergan havolani ochib, haqiqatan borligini tekshirish",
          ],
          correct: [0, 2, 3],
          explanation: "Ishonchli ohang — to'g'rilik belgisi emas. AI eng xato javobni ham juda ishonchli aytishi mumkin.",
        },
      ],
    },
    {
      id: "ai-etikasi",
      title: "AI va mas'uliyat",
      emoji: "🛡️",
      description: "Xavfsizlik, deepfake va halollik",
      steps: [
        {
          type: "text",
          emoji: "🔐",
          title: "AI — bu asbob",
          body: `Bolg'a bilan uy qurish ham, derazani sindirish ham mumkin. AI ham shunday — **qanday ishlatish insonga bog'liq**.

Uchta oltin qoida:

1. **Shaxsiy ma'lumotlaringni yozma** — parol, uy manzili, telefon raqami, hujjatlar
2. **Boshqalarni hurmat qil** — odamlarning rasm va ovozini ularning ruxsatisiz ishlatma
3. **Halol bo'l** — AI yozgan ishni o'zingniki deb topshirma`,
        },
        {
          type: "classify",
          question: "Bunday qilish mumkinmi?",
          buckets: [
            { id: "yes", label: "Mumkin", emoji: "✅" },
            { id: "no", label: "Mumkin emas", emoji: "❌" },
          ],
          items: [
            { text: "AI dan mavzuni sodda tilda tushuntirib berishni so'rash", bucket: "yes" },
            { text: "Chatbotga o'z parolingni yozish", bucket: "no" },
            { text: "AI yozgan inshoni o'zingniki deb topshirish", bucket: "no" },
            { text: "AI yordamida o'z inshoingdagi xatolarni topish", bucket: "yes" },
            { text: "Do'stingning rasmidan uning ruxsatisiz soxta video yasash", bucket: "no" },
            { text: "AI bilan test savollari tuzib, o'zingni tekshirish", bucket: "yes" },
            { text: "Uy manzilingni notanish chatbotga aytish", bucket: "no" },
          ],
        },
        {
          type: "text",
          emoji: "🎭",
          title: "Deepfake",
          body: `**Deepfake** — AI yordamida yasalgan soxta video, rasm yoki ovoz. Unda odam hech qachon aytmagan gaplarni aytayotgandek ko'rinadi.

Qanday sezish mumkin:
- 👁️ g'alati ko'z qisish, yuz chetlari «suzib» turadi
- 🗣️ lab harakati ovozga mos kelmaydi
- 😲 xabar juda shov-shuvli va hayajonga soladi

> Eng ishonchli usul: **xabarni rasmiy manbalardan tekshirish**.`,
        },
        {
          type: "quiz",
          question: "Internetda mashhur odamning g'alati video murojaatini ko'rding. Nima qilasan?",
          options: [
            "Darhol hammaga ulashaman",
            "Videoda ko'ringan bo'lsa — demak haqiqat",
            "Rasmiy manbalardan tekshiraman — bu deepfake bo'lishi mumkin",
            "Izohlarda nima yozishganiga ishonaman",
          ],
          correct: 2,
        },
        {
          type: "quiz",
          question: "AI yordamida qilingan ish uchun kim javobgar?",
          options: ["Faqat AI", "AI ni ishlatgan inson", "Hech kim", "Kompyuter ishlab chiqaruvchisi"],
          correct: 1,
          explanation: "AI — asbob. Uni qanday ishlatganing va natijasi uchun javobgarlik doim insonda.",
        },
        {
          type: "text",
          emoji: "🏆",
          title: "Tabriklayman!",
          body: `Sen endi bilasanki:

- AI misollardan o'rganadi
- neyron vaznlar yordamida qaror qiladi
- ChatGPT va Claude keyingi tokenni bashorat qiladi
- AI xato qilishi mumkin, shuning uchun uni tekshirish kerak
- AI dan xavfsiz va halol foydalanish kerak

Keyingi qadam — **«Prompt muhandisligi»** kursi: AI bilan to'g'ri gaplashishni o'rganamiz! ✍️`,
        },
      ],
    },
  ],
};
