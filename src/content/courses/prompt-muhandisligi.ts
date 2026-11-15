import type { Course } from "../types";

export const promptEngineering: Course = {
  id: "prompt-muhandisligi",
  title: "Prompt muhandisligi",
  emoji: "✍️",
  description: "AI bilan to'g'ri gaplashishni o'rgan: aniq so'rovlar, rollar, misollar va formatlar.",
  gradient: "from-sky-500 to-emerald-500",
  badge: { name: "Prompt ustasi", emoji: "🪄" },
  lessons: [
    {
      id: "prompt-nima",
      title: "Prompt nima?",
      emoji: "💡",
      description: "Nega bitta so'rov yaxshi, boshqasi esa yomon natija beradi",
      steps: [
        {
          type: "text",
          emoji: "💬",
          title: "Prompt — bu AI ga topshiriq",
          body: `**Prompt** — AI ga yoziladigan so'rov yoki ko'rsatma. ChatGPT yoki Claude ga yozgan har bir xabaring — bu prompt.

**Prompt muhandisligi** — AI dan eng yaxshi natija olish uchun so'rovlarni to'g'ri tuzish mahorati.

> AI javobining sifati ko'p jihatdan **sening promptingga** bog'liq.`,
        },
        {
          type: "text",
          emoji: "⚖️",
          title: "Ikki prompt — ikki natija",
          body: `😕 **Zaif prompt:**
> Insho yoz

AI qaysi mavzuda, kim uchun, qancha hajmda yozishni bilmaydi — natija umumiy va zerikarli bo'ladi.

💪 **Kuchli prompt:**
> 7-sinf o'quvchisi uchun «Mening sevimli faslim» mavzusida, kuz haqida, 150 so'zli insho rejasini tuzib ber. Sodda tilda yoz.

Bu yerda **mavzu**, **kim uchun**, **hajm** va **uslub** aniq.`,
        },
        {
          type: "quiz",
          question: "Qaysi prompt eng yaxshi natija beradi?",
          options: [
            "Matematika",
            "Kasrlar haqida tushuntir",
            "6-sinf o'quvchisiga kasrlarni qo'shishni pitsa misolida, 3 ta qisqa qadamda tushuntirib ber",
            "Menga yordam ber",
          ],
          correct: 2,
          explanation: "Uchinchi promptda kim uchun, qaysi mavzu, qanday misol bilan va qanday formatda — hammasi aniq.",
        },
        {
          type: "classify",
          question: "Zaif prompt yoki kuchli prompt?",
          buckets: [
            { id: "weak", label: "Zaif", emoji: "😕" },
            { id: "strong", label: "Kuchli", emoji: "💪" },
          ],
          items: [
            { text: "Hikoya yoz", bucket: "weak" },
            { text: "8 yoshli bola uchun do'stlik haqida 5 jumlali quvnoq ertak yoz", bucket: "strong" },
            { text: "Ingliz tili", bucket: "weak" },
            { text: "Pythonda ro'yxat nima ekanini 2 ta misol bilan tushuntir", bucket: "strong" },
            { text: "Nimadir ayt", bucket: "weak" },
            { text: "Fotosintezni 5-sinf o'quvchisiga 3 ta sodda jumlada tushuntir", bucket: "strong" },
          ],
        },
        {
          type: "text",
          emoji: "👫",
          title: "Oltin qoida",
          body: `AI sening fikringni o'qiy olmaydi. U sening sinfingni, o'qituvchingni va nima uchun so'rayotganingni bilmaydi.

> Prompt yozayotganda tasavvur qil: sen topshiriqni **endigina kelgan yangi sinfdoshingga** tushuntiryapsan. U hech narsani bilmaydi. Unga nimalarni aytish kerak?`,
        },
        {
          type: "quiz",
          question: "Prompt nima?",
          options: ["AI ning xatosi", "AI ga beriladigan so'rov yoki ko'rsatma", "Dasturlash tili", "Kompyuterning qismi"],
          correct: 1,
        },
      ],
    },
    {
      id: "prompt-tuzilishi",
      title: "Yaxshi promptning 4 qismi",
      emoji: "🧩",
      description: "Rol + Kontekst + Vazifa + Format",
      steps: [
        {
          type: "text",
          emoji: "🧩",
          title: "Prompt formulasi",
          body: `Kuchli promptni 4 ta qismdan yig'ish mumkin:

1. 🎭 **Rol** — AI kim bo'lib javob bersin?
   *«Sen tajribali biologiya o'qituvchisisan»*
2. 📍 **Kontekst** — vaziyat qanday, sen kimsan?
   *«Men 7-sinfdaman, ertaga nazorat ishi bor»*
3. 🎯 **Vazifa** — aniq nima qilish kerak?
   *«Hujayra tuzilishini tushuntir»*
4. 📋 **Format** — javob qanday ko'rinishda bo'lsin?
   *«5 ta qisqa band, har birida bitta misol bilan»*`,
        },
        {
          type: "classify",
          question: "Bu promptning qaysi qismi?",
          buckets: [
            { id: "role", label: "Rol", emoji: "🎭" },
            { id: "context", label: "Kontekst", emoji: "📍" },
            { id: "task", label: "Vazifa", emoji: "🎯" },
            { id: "format", label: "Format", emoji: "📋" },
          ],
          items: [
            { text: "Sen tajribali tarix o'qituvchisisan", bucket: "role" },
            { text: "Men 9-sinf o'quvchisiman va tarixni qiyin tushunaman", bucket: "context" },
            { text: "Amir Temur davlati haqida gapirib ber", bucket: "task" },
            { text: "Javobni jadval ko'rinishida ber", bucket: "format" },
            { text: "Sen sabrli matematika repetitorisan", bucket: "role" },
            { text: "Ertaga olimpiadaga boraman", bucket: "context" },
            { text: "Kvadrat tenglamani yechishni tushuntir", bucket: "task" },
            { text: "3 ta qisqa band bilan javob ber", bucket: "format" },
          ],
        },
        {
          type: "order",
          question: "Promptning qismlarini mantiqiy tartibda joylashtir",
          items: [
            "Sen tajribali ingliz tili o'qituvchisisan.",
            "Men 6-sinfdaman va ingliz tilini endi o'rganyapman.",
            "Menga Present Simple zamonini tushuntir.",
            "Javobni 3 ta qoida va 3 ta misol ko'rinishida yoz.",
          ],
          explanation: "Rol → Kontekst → Vazifa → Format. Bu tartib majburiy emas, lekin o'qish va tushunish uchun eng qulay.",
        },
        {
          type: "quiz",
          question: "«Menga fizika haqida aytib ber» promptida eng ko'p nima yetishmaydi?",
          options: [
            "Undov belgisi",
            "Ko'proq emoji",
            "Aniq vazifa va kontekst: qaysi mavzu, kim uchun, qanday formatda",
            "Hech narsa — u mukammal",
          ],
          correct: 2,
        },
        {
          type: "code",
          title: "Prompt shabloni",
          task: `Dasturchilar promptlarni ko'pincha **shablon** yordamida yig'ishadi. Pythonda buning uchun **f-string** bor: \`f"..."\` ichida \`{o'zgaruvchi}\` yozsang, uning qiymati qo'yiladi.

👉 \`{___}\` o'rniga format saqlanadigan o'zgaruvchi nomini yoz.`,
          starter: String.raw`rol = "tajribali biologiya o'qituvchisi"
kontekst = "Men 7-sinf o'quvchisiman"
vazifa = "fotosintezni tushuntir"
format_ = "3 ta qisqa band ko'rinishida"

prompt = f"Sen {rol}san. {kontekst}. Iltimos, {vazifa}. Javobni {___} yoz."

print(prompt)
`,
          tests: String.raw`assert "3 ta qisqa band ko'rinishida" in prompt, "Promptda format bo'lishi kerak"
assert prompt == "Sen tajribali biologiya o'qituvchisisan. Men 7-sinf o'quvchisiman. Iltimos, fotosintezni tushuntir. Javobni 3 ta qisqa band ko'rinishida yoz.", "Prompt matni kutilganidek emas"
`,
          solution: String.raw`rol = "tajribali biologiya o'qituvchisi"
kontekst = "Men 7-sinf o'quvchisiman"
vazifa = "fotosintezni tushuntir"
format_ = "3 ta qisqa band ko'rinishida"

prompt = f"Sen {rol}san. {kontekst}. Iltimos, {vazifa}. Javobni {format_} yoz."

print(prompt)
`,
          hint: "Yuqorida 4 ta o'zgaruvchi bor. Format qaysi birida? Diqqat: nomining oxirida pastki chiziq bor.",
        },
      ],
    },
    {
      id: "rol-va-misollar",
      title: "Rol va misollar",
      emoji: "🎭",
      description: "AI ga kim bo'lishni ayt va namuna ko'rsat",
      steps: [
        {
          type: "text",
          emoji: "🎭",
          title: "Rol javobni o'zgartiradi",
          body: `Bitta savolni turli rollar bilan so'rab ko'r:

- *«Sen 5 yoshli bolalar tarbiyachisisan. Yomg'ir nima uchun yog'adi?»* → bulutlar va tomchilar haqida ertakdek sodda javob
- *«Sen meteorolog olimsan. Yomg'ir nima uchun yog'adi?»* → kondensatsiya, namlik va bosim haqida ilmiy javob

**Rol** javobning uslubini, chuqurligini va so'zlarini o'zgartiradi.`,
        },
        {
          type: "quiz",
          question: "AI javobini 10 yoshli ukang tushunadigan qilish uchun promptga nima qo'shasan?",
          options: [
            "«Ilmiy atamalardan ko'proq foydalan»",
            "«10 yoshli bolaga tushuntirgandek, sodda so'zlar bilan tushuntir»",
            "«Javobni tezroq yoz»",
            "Hech narsa qo'shish shart emas",
          ],
          correct: 1,
        },
        {
          type: "quiz",
          question: "Ingliz tilida suhbatlashishni mashq qilmoqchisan. Qaysi rol eng mos?",
          options: [
            "«Sen oshpazsan»",
            "«Sen qattiqqo'l hakamsan, faqat baho qo'y»",
            "«Sen sabrli ingliz tili suhbatdoshisan. Men bilan oddiy mavzularda gaplash va xatolarimni muloyimlik bilan to'g'irla»",
            "«Sen kalkulyatorsan»",
          ],
          correct: 2,
        },
        {
          type: "text",
          emoji: "📝",
          title: "Misollar bilan prompt",
          body: `Ba'zan nima xohlayotganingni tushuntirishdan ko'ra **namuna ko'rsatish** osonroq. Buni *few-shot* prompt deyishadi.

> Menga hayvonlar haqida topishmoqlar kerak.
> Namuna: «Uzun quloq, kalta dum, sabzi yeydi — bu kim?» Javob: quyon.
> Xuddi shu uslubda yana 3 ta topishmoq tuz.

AI namunaga qarab uslubni, uzunlikni va formatni takrorlaydi.`,
        },
        {
          type: "quiz",
          question: "Misollar bilan prompt (few-shot) qachon ayniqsa foydali?",
          options: [
            "Hech qachon",
            "Faqat rasm chizdirishda",
            "Javob aniq bir uslub yoki formatda bo'lishini xohlaganingda",
            "AI ni sekinlashtirish uchun",
          ],
          correct: 2,
        },
        {
          type: "order",
          question: "Few-shot promptni to'g'ri tartibda yig'",
          items: [
            "Menga hayvonlar haqida topishmoqlar kerak.",
            "Namuna: «Uzun quloq, kalta dum, sabzi yeydi — bu kim?» Javob: quyon.",
            "Xuddi shu uslubda yana 3 ta topishmoq tuz.",
            "Har birining javobini alohida qatorda yoz.",
          ],
        },
      ],
    },
    {
      id: "format-va-cheklovlar",
      title: "Format va cheklovlar",
      emoji: "📐",
      description: "Javob qanday ko'rinishda va qanday chegarada bo'lsin",
      steps: [
        {
          type: "text",
          emoji: "📋",
          title: "Formatni so'ra",
          body: `AI javobni turli ko'rinishda bera oladi — faqat so'rash kerak:

- 📝 **ro'yxat** — «5 ta band qilib yoz»
- 📊 **jadval** — «jadval ko'rinishida solishtir»
- 🗂️ **reja** — «kirish, asosiy qism, xulosa»
- 🃏 **kartochkalar** — «savol-javob ko'rinishida»
- 🔢 **hajm** — «100 so'zdan oshmasin»`,
        },
        {
          type: "quiz",
          question: "5 ta kitobni muallif, janr va yil bo'yicha solishtirmoqchisan. Qaysi formatni so'raysan?",
          options: ["She'r", "Jadval", "Bitta uzun abzas", "Topishmoq"],
          correct: 1,
        },
        {
          type: "text",
          emoji: "🚧",
          title: "Cheklovlar",
          body: `**Cheklov** — AI nima qilmasligi yoki qanday chegarada qolishi kerakligi:

- «100 so'zdan oshmasin»
- «faqat o'zbek tilida yoz»
- «murakkab atamalarni ishlatma»
- «**tayyor javobni aytma, faqat maslahat ber**» ← o'qish uchun eng foydali cheklov!`,
        },
        {
          type: "quiz",
          question: "Matematika masalasini o'zing yechishni o'rganmoqchisan. AI ga qanday cheklov qo'yasan?",
          options: [
            "«Faqat javobni yoz»",
            "«Tezroq yoz»",
            "«Tayyor javobni aytma, faqat birinchi qadam uchun maslahat ber»",
            "«Ingliz tilida yoz»",
          ],
          correct: 2,
        },
        {
          type: "classify",
          question: "Bu format yoki cheklov?",
          buckets: [
            { id: "format", label: "Format", emoji: "📋" },
            { id: "limit", label: "Cheklov", emoji: "🚧" },
          ],
          items: [
            { text: "Javobni jadval qilib ber", bucket: "format" },
            { text: "200 so'zdan oshmasin", bucket: "limit" },
            { text: "Raqamlangan ro'yxat ko'rinishida yoz", bucket: "format" },
            { text: "Murakkab atamalarni ishlatma", bucket: "limit" },
            { text: "Reja shaklida yoz: kirish, asosiy qism, xulosa", bucket: "format" },
            { text: "Faqat 2020-yildan keyingi voqealarni ol", bucket: "limit" },
          ],
        },
        {
          type: "code",
          title: "Cheklovlar ro'yxati",
          task: `Dastur promptga cheklovlarni avtomatik qo'shishi kerak — har birini **yangi qatorda**, oldiga \`- \` belgisi qo'yib.

Pythonda \`"\\n"\` — yangi qator belgisi.

👉 \`___\` o'rniga har bir cheklovni promptga qo'shadigan ifodani yoz.`,
          starter: String.raw`vazifa = "Quyosh tizimi haqida qisqa matn yoz"
cheklovlar = ["100 so'zdan oshmasin", "6-sinf o'quvchisi tushunsin", "3 ta qiziqarli fakt bo'lsin"]

prompt = vazifa + ".\nTalablar:\n"
for c in cheklovlar:
    # har bir cheklovni «- » bilan boshlab, yangi qatorga qo'sh
    prompt = prompt + ___

print(prompt)
`,
          tests: String.raw`assert "___" not in prompt, "___ o'rniga ifoda yozilishi kerak"
for c in cheklovlar:
    assert "- " + c in prompt, "Promptda «- " + c + "» qatori bo'lishi kerak"
assert "oshmasin\n- 6-sinf" in prompt, "Har bir cheklov yangi qatordan boshlanishi kerak (\\n ni unutma)"
assert prompt.startswith("Quyosh tizimi haqida qisqa matn yoz.\nTalablar:\n- 100"), "Prompt boshi o'zgarmasligi kerak"
`,
          solution: String.raw`vazifa = "Quyosh tizimi haqida qisqa matn yoz"
cheklovlar = ["100 so'zdan oshmasin", "6-sinf o'quvchisi tushunsin", "3 ta qiziqarli fakt bo'lsin"]

prompt = vazifa + ".\nTalablar:\n"
for c in cheklovlar:
    # har bir cheklovni «- » bilan boshlab, yangi qatorga qo'sh
    prompt = prompt + "- " + c + "\n"

print(prompt)
`,
          hint: "Uchta bo'lakni qo'shish kerak: \"- \", keyin c, keyin \"\\n\"",
        },
      ],
    },
    {
      id: "takomillashtirish",
      title: "Suhbat va takomillashtirish",
      emoji: "🔄",
      description: "Birinchi javob — bu faqat boshlanish",
      steps: [
        {
          type: "text",
          emoji: "🔄",
          title: "Birinchi javob kamdan-kam mukammal bo'ladi",
          body: `AI bilan ishlash — bu **suhbat**. Professionallar birinchi javobni olib, uni bosqichma-bosqich yaxshilashadi:

- «Qisqaroq qil»
- «Ikkinchi bandga misol qo'sh»
- «Soddaroq so'zlar bilan qayta yoz»
- «Misollarni o'zbek hayotidan ol»

Har bir aniqlashtirish javobni sen xohlagan natijaga yaqinlashtiradi.`,
        },
        {
          type: "order",
          question: "Promptni takomillashtirish jarayonini tartibla",
          items: [
            "Birinchi promptni yozish",
            "AI javobini diqqat bilan o'qish",
            "Nima yetishmayotganini aniqlash",
            "Aniqlashtiruvchi xabar yozish",
            "Natija yaxshi bo'lguncha takrorlash",
          ],
        },
        {
          type: "quiz",
          question: "AI javobi juda uzun va murakkab bo'ldi. Keyingi xabaring qanday bo'ladi?",
          options: [
            "«Yomon»",
            "«Buni 3 ta qisqa jumlada, sodda so'zlar bilan qayta yoz»",
            "Suhbatni yopib, boshqa ishga o'taman",
            "«Yana yoz»",
          ],
          correct: 1,
        },
        {
          type: "classify",
          question: "Bu aniqlashtirish foydalimi?",
          buckets: [
            { id: "good", label: "Foydali", emoji: "👍" },
            { id: "bad", label: "Foydasiz", emoji: "👎" },
          ],
          items: [
            { text: "Misollarni o'zbek hayotidan ol", bucket: "good" },
            { text: "Boshqatdan", bucket: "bad" },
            { text: "Ikkinchi bandni batafsilroq tushuntir", bucket: "good" },
            { text: "Bu noto'g'ri", bucket: "bad" },
            { text: "Jadvalga «narx» ustunini qo'sh", bucket: "good" },
            { text: "???", bucket: "bad" },
          ],
          explanation: "Foydali aniqlashtirish AI ga aynan nimani o'zgartirish kerakligini aytadi.",
        },
        {
          type: "text",
          emoji: "🪜",
          title: "«Bosqichma-bosqich o'yla»",
          body: `Murakkab masalalarda AI ham shoshilib xato qilishi mumkin. Unga **fikrlash uchun joy ber**:

> Bu masalani bosqichma-bosqich yech. Har bir qadamni tushuntir, keyin javobni yoz.

Shunda AI har bir qadamni yozib chiqadi va kamroq xato qiladi. Sen esa yechim yo'lini ko'rib, xatoni oson topasan.`,
        },
        {
          type: "quiz",
          question: "«Bosqichma-bosqich o'ylab, yechimni tushuntir» iborasi qachon eng foydali?",
          options: ["Salomlashganda", "Matematika va mantiqiy masalalarda", "Rasm so'raganda", "Hech qachon"],
          correct: 1,
        },
      ],
    },
    {
      id: "ai-bilan-oqish",
      title: "AI — o'qishdagi yordamchi",
      emoji: "🎓",
      description: "AI bilan o'rganish, lekin uning o'rniga emas",
      steps: [
        {
          type: "text",
          emoji: "🎓",
          title: "AI — shaxsiy repetitor",
          body: `AI dan eng yaxshi foydalanish — u **sen bilan birga o'rganganda**, sening o'rningga emas.

✅ **Foydali:**
- mavzuni sodda tushuntirish
- o'zingni tekshirish uchun test tuzish
- inshoingdagi xatolarni ko'rsatish
- o'qish rejasini tuzish

❌ **Foydasiz:**
- uy vazifasini to'liq yechdirib, ko'chirib olish — miya hech narsa o'rganmaydi`,
        },
        {
          type: "classify",
          question: "Bu prompt o'rganishga yordam beradimi?",
          buckets: [
            { id: "learn", label: "O'rgatadi", emoji: "🌱" },
            { id: "cheat", label: "O'rniga qiladi", emoji: "🙈" },
          ],
          items: [
            { text: "Mavzu bo'yicha menga 5 ta test savoli tuz", bucket: "learn" },
            { text: "Uy vazifamni to'liq yechib ber, ko'chirib olaman", bucket: "cheat" },
            { text: "Inshoimni o'qib, 3 ta kamchilikni ko'rsat, lekin o'zing qayta yozma", bucket: "learn" },
            { text: "Menga insho yozib ber, o'qituvchi bilmaydi", bucket: "cheat" },
            { text: "Bu formula nima uchun aynan shunday ekanini tushuntir", bucket: "learn" },
          ],
        },
        {
          type: "quiz",
          question: "Qaysi prompt «AI-repetitor» sifatida eng yaxshi?",
          options: [
            "«Kasrlar bo'yicha uy vazifamning javoblarini yoz»",
            "«Kasrlar»",
            "«Men kasrlarni o'rganyapman. Menga bittadan masala ber, javobimni tekshir va xato qilsam maslahat ber»",
            "«Hamma javoblarni ber»",
          ],
          correct: 2,
        },
        {
          type: "code",
          title: "Yakuniy loyiha: repetitor-prompt generatori",
          task: `Endi har qanday fan uchun «AI-repetitor» promptini yasaydigan funksiya yoz!

👉 Uchta \`___\` o'rniga \`{fan}\`, \`{sinf}\` va \`{mavzu}\` ni to'g'ri joylarga qo'y.

Keyin pastda o'z faning bilan sinab ko'r va natijani haqiqiy AI da ishlatib ko'r!`,
          starter: String.raw`def repetitor_prompt(fan, mavzu, sinf):
    return f"Sen sabrli ___ o'qituvchisisan. Men ___-sinf o'quvchisiman va ___ mavzusini o'rganyapman. Menga bittadan savol ber, javobimni tekshir, lekin to'g'ri javobni darhol aytma."

print(repetitor_prompt("fizika", "Nyuton qonunlari", 8))
`,
          tests: String.raw`p = repetitor_prompt("fizika", "Nyuton qonunlari", 8)
assert "___" not in p, "Hamma ___ larni almashtirish kerak"
assert "sabrli fizika o'qituvchisisan" in p, "Fan nomi «sabrli ...» dan keyin kelishi kerak"
assert "8-sinf" in p, "Sinf raqami «-sinf» dan oldin turishi kerak"
assert "va Nyuton qonunlari mavzusini" in p, "Mavzu «mavzusini» so'zidan oldin turishi kerak"
p2 = repetitor_prompt("kimyo", "Atomlar", 9)
assert "kimyo" in p2 and "Atomlar" in p2 and "9-sinf" in p2, "Funksiya boshqa qiymatlar bilan ham ishlashi kerak"
`,
          solution: String.raw`def repetitor_prompt(fan, mavzu, sinf):
    return f"Sen sabrli {fan} o'qituvchisisan. Men {sinf}-sinf o'quvchisiman va {mavzu} mavzusini o'rganyapman. Menga bittadan savol ber, javobimni tekshir, lekin to'g'ri javobni darhol aytma."

print(repetitor_prompt("fizika", "Nyuton qonunlari", 8))
`,
          hint: "f-string ichida o'zgaruvchini jingalak qavsga ol: {fan}",
        },
        {
          type: "text",
          emoji: "🪄",
          title: "Sen endi prompt muhandisisan!",
          body: `Sen o'rgandingki:

- yaxshi prompt **aniq** bo'ladi
- uni **Rol + Kontekst + Vazifa + Format** dan yig'ish mumkin
- **misollar** AI ga uslubni ko'rsatadi
- **cheklovlar** javobni boshqaradi
- birinchi javobni **takomillashtirish** kerak
- AI — **o'rganish uchun** yordamchi

O'qituvching bilan birga o'z promptlaringni haqiqiy AI da sinab ko'r! 🚀`,
        },
      ],
    },
  ],
};
