export interface Article {
  id: string
  title: string
  category: string
  content: string
  excerpt: string
  date: string
  readTime: string
  author?: string
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

export const articlesData: Article[] = [
  {
    id: "1",
    title: "Understanding the Evil Eye in Islam",
    category: "Evil Eye & Envy",
    excerpt:
      "Learn about the reality of the evil eye, its effects, and how to protect yourself according to authentic Islamic teachings.",
    date: "March 15, 2024",
    readTime: "8 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>What is the Evil Eye?</h2>
      <p>The evil eye (al-'ayn) is a real phenomenon that is well-documented in Islamic texts. The Prophet Muhammad ﷺ said: "The evil eye is real, and if anything were to overtake the divine decree, it would be the evil eye." (Sahih Muslim)</p>
      
      <h3>Signs and Symptoms</h3>
      <p>The effects of the evil eye can manifest in various ways:</p>
      <ul>
        <li>Sudden illness or physical discomfort</li>
        <li>Unexplained anxiety or depression</li>
        <li>Loss of blessings in wealth or health</li>
        <li>Relationship problems</li>
        <li>Business or career setbacks</li>
      </ul>
      
      <h3>Protection from the Evil Eye</h3>
      <p>Islam provides us with powerful means of protection:</p>
      <ol>
        <li><strong>Regular recitation of Ayat al-Kursi</strong> - The greatest verse in the Quran provides immense protection</li>
        <li><strong>The last two verses of Surah Al-Baqarah</strong> - Recite these before sleeping</li>
        <li><strong>Surah Al-Falaq and An-Nas</strong> - The two protective chapters (Mu'awwidhatayn)</li>
        <li><strong>Morning and evening adhkar</strong> - Prophetic supplications for daily protection</li>
      </ol>
      
      <h3>Treatment with Ruqya</h3>
      <p>If you suspect you've been affected by the evil eye, perform Ruqya by reciting:</p>
      <ul>
        <li>Surah Al-Fatihah (7 times)</li>
        <li>Ayat al-Kursi (3 times)</li>
        <li>Surah Al-Ikhlas, Al-Falaq, and An-Nas (3 times each)</li>
      </ul>
      
      <p>Blow on your hands after each recitation and wipe over your body. You can also recite over water and drink it or use it for bathing.</p>
      
      <h3>Seeking Allah's Protection</h3>
      <p>Remember that all protection ultimately comes from Allah. The Prophet ﷺ used to seek protection for his grandsons by saying: "I seek refuge for you in the perfect words of Allah from every devil and poisonous creature, and from every evil eye." (Sahih Bukhari)</p>
      
      <p>May Allah protect us all from the evil eye and grant us healing through His words.</p>
    `,
  },
  {
    id: "2",
    title: "Signs and Symptoms of Black Magic",
    category: "Black Magic",
    excerpt: "Discover the signs of black magic and sihr, and learn the Islamic approach to diagnosis and treatment.",
    date: "March 12, 2024",
    readTime: "10 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>Understanding Black Magic (Sihr)</h2>
      <p>Black magic, known as sihr in Arabic, is a reality acknowledged in the Quran and Sunnah. Allah says in the Quran: "And they followed what the devils had recited during the reign of Solomon. It was not Solomon who disbelieved, but the devils disbelieved, teaching people magic." (Quran 2:102)</p>
      
      <h3>Common Signs of Black Magic</h3>
      <p>While these signs don't definitively prove black magic, they may indicate its presence:</p>
      <ul>
        <li>Sudden personality changes or behavioral shifts</li>
        <li>Unexplained hatred toward spouse or family members</li>
        <li>Recurring nightmares or disturbing dreams</li>
        <li>Physical symptoms with no medical explanation</li>
        <li>Aversion to worship or hearing Quran</li>
        <li>Feeling of heaviness or tightness in the chest</li>
      </ul>
      
      <h3>Types of Black Magic</h3>
      <p>Sihr can take various forms:</p>
      <ol>
        <li><strong>Sihr of Separation</strong> - Causing division between loved ones</li>
        <li><strong>Sihr of Love</strong> - Creating unnatural attraction</li>
        <li><strong>Sihr of Illness</strong> - Causing physical or mental ailments</li>
        <li><strong>Sihr of Madness</strong> - Affecting the mind and sanity</li>
      </ol>
      
      <h3>Islamic Treatment</h3>
      <p>The cure for black magic lies in the Quran and authentic Prophetic practices:</p>
      <ul>
        <li>Regular recitation of Surah Al-Baqarah in your home</li>
        <li>Performing Ruqya with Quranic verses</li>
        <li>Maintaining the five daily prayers</li>
        <li>Reciting morning and evening adhkar</li>
        <li>Seeking help from qualified Raqi (Ruqya practitioner)</li>
      </ul>
      
      <p>Remember, patience and trust in Allah are essential during treatment. The Prophet ﷺ said: "No disease has Allah created except that He has also created its cure." (Sahih Bukhari)</p>
    `,
  },
  {
    id: "3",
    title: "Jinn Possession: Fact vs Fiction",
    category: "Jinn Possession",
    excerpt: "Separating truth from myth about jinn possession based on Quran and authentic Hadith.",
    date: "March 10, 2024",
    readTime: "12 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>The Reality of Jinn</h2>
      <p>Jinn are real beings created by Allah from smokeless fire. The Quran states: "And the jinn We created before from scorching fire." (Quran 15:27)</p>
      
      <h3>Can Jinn Possess Humans?</h3>
      <p>Yes, jinn possession is real and acknowledged by Islamic scholars based on Quranic verses and authentic hadiths. However, many cases attributed to jinn possession may actually be psychological or medical conditions.</p>
      
      <h3>Signs of Genuine Possession</h3>
      <ul>
        <li>Speaking in languages unknown to the person</li>
        <li>Supernatural strength during episodes</li>
        <li>Knowledge of hidden information</li>
        <li>Severe reaction to Quranic recitation</li>
        <li>Personality changes and memory loss</li>
      </ul>
      
      <h3>Treatment Through Ruqya</h3>
      <p>The Islamic treatment for jinn possession involves:</p>
      <ol>
        <li>Recitation of specific Quranic verses</li>
        <li>Prophetic supplications</li>
        <li>Strengthening one's faith and worship</li>
        <li>Seeking help from qualified practitioners</li>
      </ol>
      
      <p>It's crucial to consult medical professionals first to rule out physical or psychological conditions before attributing symptoms to jinn possession.</p>
    `,
  },
  {
    id: "4",
    title: "Dealing with Jinn Aashiq (Jinn Lover)",
    category: "Jinn 'Aashiq",
    excerpt: "Understanding the phenomenon of jinn attachment and the Islamic method of treatment and protection.",
    date: "March 8, 2024",
    readTime: "9 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>What is Jinn Aashiq?</h2>
      <p>Jinn Aashiq refers to a jinn that develops an attachment or "love" for a human being. This is a serious spiritual affliction that requires proper Islamic treatment.</p>
      
      <h3>Signs and Symptoms</h3>
      <ul>
        <li>Recurring dreams of the same person</li>
        <li>Feeling of being watched or followed</li>
        <li>Unexplained physical sensations</li>
        <li>Difficulty in marriage or relationships</li>
        <li>Aversion to opposite gender</li>
      </ul>
      
      <h3>Islamic Treatment</h3>
      <p>Treatment involves consistent Ruqya, strengthening faith, and maintaining protective practices from the Sunnah.</p>
    `,
  },
  {
    id: "5",
    title: "The Truth About Taweez and Amulets",
    category: "Taweez",
    excerpt: "Islamic ruling on taweez, amulets, and charms. What is permissible and what is shirk?",
    date: "March 5, 2024",
    readTime: "7 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>Understanding Taweez</h2>
      <p>Taweez (amulets) are objects worn for protection or blessings. The Islamic ruling on them depends on their content and the belief associated with them.</p>
      
      <h3>Permissible vs Prohibited</h3>
      <p>Taweez containing only Quranic verses or authentic supplications may be permissible according to some scholars, but many scholars prohibit all forms of taweez to prevent shirk (associating partners with Allah).</p>
      
      <h3>The Safer Path</h3>
      <p>The safest approach is to rely on direct recitation of Quran and authentic duas rather than wearing amulets, as this was the practice of the Prophet ﷺ and his companions.</p>
    `,
  },
  {
    id: "6",
    title: "Protecting Your Children with Ruqya",
    category: "Ruqya for Children",
    excerpt: "How to perform Ruqya on children and protect them from spiritual harm according to the Sunnah.",
    date: "March 3, 2024",
    readTime: "6 min read",
    author: "Sheikh Ahmad",
    content: `
      <h2>Ruqya for Children</h2>
      <p>Children are especially vulnerable to spiritual harm, and the Prophet ﷺ used to perform Ruqya on his grandsons regularly.</p>
      
      <h3>Prophetic Method</h3>
      <p>The Prophet ﷺ would say: "I seek refuge for you in the perfect words of Allah from every devil and poisonous creature, and from every evil eye."</p>
      
      <h3>Daily Protection</h3>
      <ul>
        <li>Recite Ayat al-Kursi over them before sleep</li>
        <li>Blow on them after reciting the Mu'awwidhatayn</li>
        <li>Teach them age-appropriate adhkar</li>
        <li>Maintain a spiritually clean home environment</li>
      </ul>
    `,
  },
]

export function getArticleBySlug(slug: string): Article | undefined {
  return articlesData.find((article) => generateSlug(article.title) === slug)
}

export function getRelatedArticles(currentArticleId: string, category: string, limit = 3): Article[] {
  return articlesData
    .filter((article) => article.id !== currentArticleId && article.category === category)
    .slice(0, limit)
}
