"""Seed database with initial data."""
import sys
from pathlib import Path

# Add parent directory to path
sys.path.append(str(Path(__file__).resolve().parents[1]))

from app.database import SessionLocal
from app.models.user import User, UserRole
from app.models.service import Service
from app.models.article import Article
from app.models.podcast import Podcast
from app.models.audio import Audio
from app.models.product import Product
from app.core.security import get_password_hash
from datetime import datetime, timedelta
from slugify import slugify
import uuid


def seed_users(db):
    """Seed users."""
    print("👤 Seeding users...")
    
    # Check if admin exists
    admin = db.query(User).filter(User.email == "admin@ruqyahealinghub.com").first()
    
    if not admin:
        admin = User(
            id=str(uuid.uuid4()),
            email="admin@ruqyahealinghub.com",
            hashed_password=get_password_hash("admin123"),
            full_name="Admin User",
            phone="+1234567890",
            role=UserRole.ADMIN,
            is_active=True
        )
        db.add(admin)
        print("  ✅ Admin user created")
    else:
        print("  ⏭️  Admin user already exists")
    
    # Create test user
    test_user = db.query(User).filter(User.email == "user@example.com").first()
    if not test_user:
        test_user = User(
            id=str(uuid.uuid4()),
            email="user@example.com",
            hashed_password=get_password_hash("user123"),
            full_name="Test User",
            phone="+1234567891",
            role=UserRole.USER,
            is_active=True
        )
        db.add(test_user)
        print("  ✅ Test user created")


def seed_services(db):
    """Seed services."""
    print("🛎️  Seeding services...")
    
    services_data = [
        {
            "title": "Spiritual & Health Diagnosis Consultation",
            "description": "Professional diagnosis of spiritual and health issues including Jinn possession, evil eye (Ayn), and black magic (Sihr). Comprehensive assessment with personalized solution recommendations and treatment plan.",
            "price": 10000.00,
            "duration": 60,
            "is_active": True
        },
        {
            "title": "Counseling Services",
            "description": "Islamic counseling sessions to help you navigate life challenges with guidance from Qur'an and Sunnah. Addressing personal, family, and spiritual matters with compassion and Islamic wisdom.",
            "price": 15000.00,
            "duration": 45,
            "is_active": True
        },
        {
            "title": "Marital Issues Consultation",
            "description": "Specialized Islamic counseling for married couples facing difficulties. Help resolve conflicts, improve communication, and strengthen your marriage according to Islamic principles. Confidential and compassionate support.",
            "price": 20000.00,
            "duration": 60,
            "is_active": True
        },
        {
            "title": "Ruqyah Healing with Products",
            "description": "Complete Ruqyah healing session combined with blessed products package. Includes professional Ruqyah recitation, Ruqyah water, blessed oils, and treatment products. Comprehensive healing approach for maximum benefit.",
            "price": 50000.00,
            "duration": 90,
            "is_active": True
        },
        {
            "title": "Questions & Advice Session",
            "description": "Ask any questions about Ruqyah, Islamic healing, spiritual protection, or general Islamic guidance. Get expert advice and answers based on Qur'an and authentic Sunnah. Quick consultation for your concerns.",
            "price": 5000.00,
            "duration": 30,
            "is_active": True
        }
    ]
    
    for service_data in services_data:
        existing = db.query(Service).filter(Service.title == service_data["title"]).first()
        
        if not existing:
            service = Service(
                id=str(uuid.uuid4()),
                **service_data
            )
            db.add(service)
    
    print("  ✅ Services seeded")


def seed_articles(db):
    """Seed articles."""
    print("📰 Seeding articles...")
    
    articles_data = [
        {
            "title": "Jinn in the Qur'an",
            "slug": "jinn-in-the-quran",
            "excerpt": "Understanding Jinn from the Qur'anic perspective - their creation, nature, and the Islamic definition of these unseen beings.",
            "content": """
            <h2>JINN IN THE QUR'AN</h2>
            
            <h3>Qur'anic Verses About Jinn</h3>
            
            <blockquote>
            <p><strong>"And the Jinn we created before from scorching fire."</strong> (Al-Hijr: 27)</p>
            </blockquote>
            
            <blockquote>
            <p><strong>"O assembly of jinn and men! Did there not come to you Messengers from amongst you, relating to you My communications and warning you of the meeting of this day of yours? They shall say: We bear witness against ourselves; and this world's life deceived them, and they shall bear witness against their own souls that they were unbelievers"</strong> (Al-Anaam: 130)</p>
            </blockquote>
            
            <blockquote>
            <p><strong>"And certainly We have created for hell many of the jinn and the men; they have hearts with which they do not understand, and they have eyes with which they do not see, and they have ears with which they do not hear; they are as cattle, nay, they are in worse errors; these are the heedless ones"</strong> (Al-A'raf: 179)</p>
            </blockquote>
            
            <blockquote>
            <p><strong>"And those who disbelieve will say: Our Lord! Show us those who led us astray from among the jinn and the men that we may trample them under our feet so that they may be of the lowest"</strong> (Al-Fussilat: 29)</p>
            </blockquote>
            
            <h2>THE DEFINITION OF JINN</h2>
            
            <p>The word jinn, al jaan, al jinnaan occurs <strong>29 times in the Qur'an</strong>.</p>
            
            <p>Jinn in Arabic literally means <strong>"hidden from sight"</strong> and is derived from the Arabic root j'n'n (pronounced: jann-junn) meaning "to hide" or "be hidden".</p>
            
            <h3>Words Derived from the Same Root:</h3>
            <ul>
                <li><strong>Majnun</strong> - 'mad' (one whose intellect is hidden)</li>
                <li><strong>Junuun</strong> - 'madness'</li>
                <li><strong>Janin</strong> - 'embryo, fetus' (hidden inside the womb)</li>
            </ul>
            
            <h3>Scholarly Explanations</h3>
            
            <p>Al Jawhari (the author of Al-Sihaah al hakeem; page 19) explains:</p>
            
            <blockquote>
            <p>"Al-jann is the father of the jinn, the plural of which is jeenaan. All of that which is concealed from you is Junna'anka (concealed from you). Janna al-layl means the darkness of the night. Al-jaan is the plural of Al-Jinn. Jannahu al-layl means the night covered him."</p>
            </blockquote>
            
            <p>The above is the root meaning of the word Jinn. This material is extracted from the works of Ashibly and Al-jawhari.</p>
            
            <h3>Related Terminology</h3>
            
            <p><strong>The grave and shroud is called jenanan</strong> because they cover the dead.</p>
            
            <p><strong>وسمي القلب جناناً، لأنه مستور في الصدر، ويستر داخله أخباراً وأسراراً</strong><br>
            The heart is called jeenan because it is concealed in the chest.</p>
            
            <p><strong>وسميت الروح جناناً، لأن الجسم يسترها</strong><br>
            The spirit is called jananan because the body conceals it.</p>
            
            <h3>Key Points:</h3>
            <ul>
                <li>Jinn were created from scorching fire</li>
                <li>Jinn, like humans, have free will and will be held accountable</li>
                <li>Both jinn and humans received Messengers and guidance</li>
                <li>The term "jinn" fundamentally means "hidden" or "concealed"</li>
                <li>This reflects their nature as unseen beings</li>
            </ul>
            """,
            "category": "Education",
            "author": "Ruqyah Healing Hub",
            "read_time": 8,
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=5)
        },
        {
            "title": "Evil Eye & Envy (Ayn & Hasad)",
            "slug": "evil-eye-envy-ayn-hasad",
            "excerpt": "Comprehensive guide to understanding the Evil Eye (Ayn) and Envy (Hasad) in Islam, their different types, and protection methods.",
            "content": """
            <h2>EVIL EYE & ENVY (AYN & HASAD)</h2>
            
            <h2>THE CONCEPT OF THE EVIL EYE (AYN)</h2>
            
            <p>A person who afflicts others by the evil eye is known as <strong>"Al-A'in"</strong> and a person affected by the evil eye is called <strong>"Al-Ma'yoon"</strong>.</p>
            
            <p>Ibn Al Qayyim (RA) said in his book Zaad al Ma'ad:</p>
            
            <blockquote>
            <p>"It is the arrow that is taken out from the soul of the envious individual, the one whom causes the affliction of the evil eye, and then it is fired upon the subject of the evil eye. This individual can be affected sometimes and manage to escape it at other times. If one encounters this and is exposed to it then there will be no protection from its effect, however it then becomes imperative if one encounters this to take care and prepare themselves with the best defence and not allow it to be implanted upon them. It is in this manner that a person can protect themselves from the envious individual and not be effected by them.</p>
            
            <p>Sometimes these arrows return to the one whom they belong and this archery makes the envious individual feel the same negativity in his life like the negatively he tried to push on the subject."</p>
            </blockquote>
            
            <h3>Evidence from the Qur'an</h3>
            
            <p>Allah (SWT) says:</p>
            
            <blockquote>
            <p><strong>"And indeed, those who disbelieve would almost make you slip with their eyes when they hear the message and they say, 'Indeed, he is mad.'"</strong> (Al-Qalam: 51)</p>
            </blockquote>
            
            <p>Ibn Katheer (RA) uses this verse as evidence to show that the evil eye is real and that it has the ability to effect people since Allah (SWT) mentions 'those who disbelieve would almost make you slip with their eyes when they hear the message'.</p>
            
            <h3>Historical Account</h3>
            
            <p>An incident which is narrated from the time of Prophet Muhammad ﷺ: Quraish asked some people who were known to give the evil eye to another person which could cause illness, death or some other effect to put it on the Prophet ﷺ. However, Allah (SWT) protected the Prophet Muhammad ﷺ from those who were intent on destroying him with Ayn.</p>
            
            <p>Ibnul Qayyim (RA) mentioned in his book Zaad al Ma'ad that some people have denied the effects of Ayn; and he describes these people as arrogant with no knowledge.</p>
            
            <h3>Understanding the Phenomenon</h3>
            
            <p>According to some scholars, the concept of effecting a person with the evil eye (Ayn) can be likened to the effect of when a person walks into a room and they feel embarrassment or shyness due to people looking at them, perhaps causing the face to change colour. Another example could be where someone sees someone they fear and they become pale in the face.</p>
            
            <p>Ibnul Qayyim (RA) describes it as a physical or spiritual effect that leaves the eye and effects the human being.</p>
            
            <h2>THE DIFFERENT TYPES OF EVIL EYE (AYN)</h2>
            
            <h3>1. Ayn (العين)</h3>
            <p>The eye from someone who may love or know you and not have evil intentions towards you.</p>
            
            <h4>Evidence for Ayn:</h4>
            <p>The Prophet ﷺ said: <strong>"The evil eye is real and if anything were to overtake Qadr (divine decree), it would have been the evil eye..."</strong></p>
            <p>This alludes to the speed of the evil eye and expresses that if anything was to overtake the decree of Allah it would have been the evil eye, i.e. in its speed.</p>
            
            <h3>2. Hasad (الحسد)</h3>
            <p>The envious eye from someone who hates or dislikes you or something you have but wants it removed from you.</p>
            
            <h4>Evidence for Hasad:</h4>
            <p>Iblees envied Adam (AS) as he disliked his creation and the fact he was ordered to prostate to him. He thought he was better because he was made from fire and Adam (AS) was created from clay. Therefore it was only envy which pushed Iblees to transgress and disobey the order of Allah (SWT).</p>
            
            <h3>3. Nafs (النفس)</h3>
            <p>The admiring eye which a person can put on themselves.</p>
            
            <h4>Evidence for Nafs:</h4>
            <p>The Prophet ﷺ said: <strong>"Whoever among you sees something in himself or in his possessions or in his brother that he likes, let him pray for blessings for it because the evil eye is real."</strong></p>
            <p><em>Narrated by Ibn al-Sunni, Al-Haakim and classed as saheeh by Al-Albaani 243.</em></p>
            
            <h3>4. Nathara (النظرة)</h3>
            <p>The evil eye which comes from the Jinn.</p>
            
            <h4>Evidence for Nathara:</h4>
            <p>This originates from the evil eye of a Jinn. The evidence for this is the narration of Umm Salamah (RAA) who said the Prophet ﷺ saw in her house a slave girl with a discolouration on her face so he said: <strong>"Perform Ruqya for her, for she has been afflicted by the eye of a Jinn."</strong></p>
            
            <h3>Summary</h3>
            
            <p>From the above, we see that the evil eye can be given by a human or by a Jinn. It is also known that animals can give the evil eye too when they look at something. There are many stories and encounters concerning this and Allah knows best.</p>
            
            <h3>Key Points to Remember:</h3>
            <ul>
                <li>The evil eye is real and recognized in Islam</li>
                <li>There are four main types of evil eye: Ayn, Hasad, Nafs, and Nathara</li>
                <li>Protection comes through Allah's remembrance and seeking refuge in Him</li>
                <li>Even loved ones can unintentionally give the evil eye</li>
                <li>One should always say "Masha'Allah" when seeing something admirable</li>
                <li>Regular Ruqya and adhkar provide protection</li>
            </ul>
            """,
            "category": "Protection",
            "author": "Ruqyah Healing Hub",
            "read_time": 12,
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=3)
        },
        {
            "title": "Evidence for Ruqyah in Hadith",
            "slug": "evidence-ruqyah-hadith",
            "excerpt": "Understanding the prophetic evidence and Islamic rulings regarding Ruqyah from the Sunnah of Prophet Muhammad ﷺ.",
            "content": """
            <h2>EVIDENCE IN HADITH</h2>
            
            <p>These conditions can be found in <strong>'Fath Al-Bari'</strong> and in the sayings of <strong>Shaykh al-Islam Ibn Taymiyyah</strong> concerning healing the one who is possessed.</p>
            
            <h3>The Permissibility of Ruqyah</h3>
            
            <p>Evidence can be found in the Sunnah of the Prophet ﷺ in regards to Ruqyah being allowed; this is encouraged in the following Hadith:</p>
            
            <blockquote>
            <p><strong>Awf Ibn Malik al-Ashja'i (RAA) narrated that he said to the Prophet:</strong></p>
            <p>"O Allah's Messenger! We used to do Ruqyah during the days of Jahiliyyah (pre-Islamic era). What do you think of that?"</p>
            <p><strong>He replied:</strong> "Present your Ruqyah to me; there is nothing wrong with it as long as it does not involve Shirk."</p>
            <p><em>(Sahih Muslim)</em></p>
            </blockquote>
            
            <h3>The Islamic Ruling</h3>
            
            <p>Therefore, <strong>Ruqyah Shar'iyyah is permissible and legal in Islam.</strong></p>
            
            <h3>Key Points from this Hadith:</h3>
            
            <ul>
                <li><strong>Ruqyah was practiced before Islam</strong> - Even in the pre-Islamic era, people performed Ruqyah</li>
                <li><strong>The Prophet ﷺ approved of Ruqyah</strong> - He did not forbid the practice entirely</li>
                <li><strong>The condition: It must not involve Shirk</strong> - The only prohibition is when Ruqyah contains elements of polytheism</li>
                <li><strong>Ruqyah must be examined</strong> - The Prophet ﷺ said "Present your Ruqyah to me" indicating that the content matters</li>
                <li><strong>Islamic Ruqyah is encouraged</strong> - When done according to Shari'ah, it is a recommended practice</li>
            </ul>
            
            <h3>What Makes Ruqyah Shar'iyyah (Legal Islamic Ruqyah)?</h3>
            
            <p>For Ruqyah to be permissible in Islam, it must meet the following conditions:</p>
            
            <ol>
                <li><strong>It must be with the words of Allah (Qur'an)</strong> - Using verses from the Qur'an</li>
                <li><strong>Or authentic supplications from the Sunnah</strong> - Using duas taught by the Prophet ﷺ</li>
                <li><strong>It must be in Arabic or understood language</strong> - The person should understand what is being recited</li>
                <li><strong>It must not contain any Shirk</strong> - No polytheistic elements or seeking help from other than Allah</li>
                <li><strong>Belief that Ruqyah has no power by itself</strong> - Only Allah has the power to heal, Ruqyah is merely a means</li>
            </ol>
            
            <h3>Scholarly References</h3>
            
            <p>The conditions and rulings regarding Ruqyah can be found in:</p>
            <ul>
                <li><strong>Fath Al-Bari</strong> - The famous commentary on Sahih Al-Bukhari by Ibn Hajar Al-Asqalani</li>
                <li><strong>Works of Shaykh al-Islam Ibn Taymiyyah</strong> - Concerning healing those who are possessed by Jinn</li>
                <li><strong>Sahih Muslim</strong> - The authentic hadith collection containing the narration of Awf Ibn Malik</li>
            </ul>
            
            <h3>Conclusion</h3>
            
            <p>Ruqyah is a blessed practice from the Sunnah of the Prophet ﷺ. When performed correctly, according to Islamic guidelines and free from any elements of Shirk, it is not only permissible but encouraged as a means of seeking healing and protection from Allah (SWT).</p>
            
            <p>The key is to ensure that all Ruqyah practices are firmly rooted in the Qur'an and authentic Sunnah, with complete reliance on Allah alone for healing and protection.</p>
            """,
            "category": "Education",
            "author": "Ruqyah Healing Hub",
            "read_time": 7,
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=2)
        },
        {
            "title": "Types of Ruqyah: Shar'iyyah vs Shirk'iyyah",
            "slug": "types-of-ruqyah",
            "excerpt": "Understanding the difference between permissible Islamic Ruqyah and forbidden practices that involve shirk.",
            "content": """
            <h2>TYPES OF RUQYAH</h2>
            
            <p>It is crucial for every Muslim to understand that there are two fundamentally different types of Ruqyah: one that is permissible and blessed, and one that is forbidden and leads to destruction.</p>
            
            <h2>1. Ruqyah Shar'iyyah (Permissible Islamic Ruqyah)</h2>
            
            <h3>Definition</h3>
            <p><strong>Ruqyah Shar'iyyah</strong> is an Islamic healing practice involving Qur'anic recitation, authentic supplications, and seeking help from Allah alone, free from any form of shirk.</p>
            
            <h3>What is Ruqyah Shar'iyyah?</h3>
            <p>Ruqyah is an Islamic practice of reciting verses from the Quran and making supplications to seek healing and protection from ailments, both physical and spiritual. It is effective against illnesses caused by the evil eye, black magic, and possession by jinn.</p>
            
            <h3>Key Characteristics of Ruqyah Shar'iyyah:</h3>
            <ul>
                <li><strong>Uses only Qur'anic verses</strong> - All recitations are from the Holy Qur'an</li>
                <li><strong>Uses authentic Prophetic supplications</strong> - Duas taught by Prophet Muhammad ﷺ</li>
                <li><strong>Seeks help from Allah alone</strong> - Complete reliance on Allah (SWT) for healing</li>
                <li><strong>Free from shirk</strong> - Contains no polytheistic elements whatsoever</li>
                <li><strong>Clear and understandable</strong> - Recitations are in Arabic or a language the person understands</li>
                <li><strong>Based on Islamic teachings</strong> - Follows the methodology of the Qur'an and Sunnah</li>
            </ul>
            
            <h3>What Can Ruqyah Shar'iyyah Treat?</h3>
            <ul>
                <li>Evil eye (Ayn)</li>
                <li>Black magic (Sihr)</li>
                <li>Jinn possession</li>
                <li>Spiritual ailments</li>
                <li>Physical illnesses (as a means, with medical treatment)</li>
                <li>Anxiety and psychological distress</li>
            </ul>
            
            <h3>The Ruling</h3>
            <p>Ruqyah Shar'iyyah is <strong>permissible and encouraged</strong> in Islam. It is a blessed practice that brings the believer closer to Allah and provides healing through His words.</p>
            
            <h2>2. Ruqyah Shirk'iyyah (Forbidden Ruqyah)</h2>
            
            <h3>Definition</h3>
            <p><strong>Ruqyah Shirk'iyyah</strong> is a type of Ruqyah that leads to sin and destruction upon the individual as it involves calling upon other than Allah (SWT).</p>
            
            <h3>What Does Ruqyah Shirk'iyyah Involve?</h3>
            <p>This forbidden type of Ruqyah entails:</p>
            <ul>
                <li><strong>Seeking assistance from Jinn</strong> - Calling upon jinn for help or healing</li>
                <li><strong>Consulting magicians and sorcerers</strong> - Going to those who practice black magic</li>
                <li><strong>Using horoscopes and fortune-telling</strong> - Believing in or using astrology for guidance</li>
                <li><strong>Using charms and amulets</strong> - Wearing talismans that contain shirk or unknown writings</li>
                <li><strong>Reciting incomprehensible words</strong> - Using words that are not from Qur'an or Sunnah</li>
                <li><strong>Making sacrifices to other than Allah</strong> - Offering animals or items to jinn or spirits</li>
                <li><strong>Invoking dead people or "saints"</strong> - Seeking help from the deceased</li>
            </ul>
            
            <h3>The Ruling</h3>
            <p>It is clear that this practice is <strong>completely forbidden in Islam</strong>, which is evident from the Hadith of the Prophet ﷺ.</p>
            
            <div style="background-color: #fff3cd; padding: 15px; border-left: 4px solid #ffc107; margin: 20px 0;">
            <h4>⚠️ WARNING</h4>
            <p><strong>Ruqyah Shirk'iyyah is a major sin in Islam.</strong> It involves associating partners with Allah (shirk), which is the greatest sin. Those who practice or seek such treatment are committing a grave transgression against the Tawheed (Oneness of Allah).</p>
            </div>
            
            <h3>Why is Ruqyah Shirk'iyyah Dangerous?</h3>
            <ol>
                <li><strong>It is shirk (polytheism)</strong> - The greatest sin in Islam</li>
                <li><strong>It nullifies one's faith</strong> - Shirk contradicts the testimony of faith</li>
                <li><strong>It brings no real benefit</strong> - Only Allah can truly heal and help</li>
                <li><strong>It invites more harm</strong> - Opens doors to further spiritual afflictions</li>
                <li><strong>It is deception by Shaytan</strong> - The devil deceives people into associating partners with Allah</li>
            </ol>
            
            <h2>How to Distinguish Between the Two</h2>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                <thead>
                    <tr style="background-color: #f8f9fa;">
                        <th style="border: 1px solid #dee2e6; padding: 12px;">Aspect</th>
                        <th style="border: 1px solid #dee2e6; padding: 12px;">Ruqyah Shar'iyyah ✅</th>
                        <th style="border: 1px solid #dee2e6; padding: 12px;">Ruqyah Shirk'iyyah ❌</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;"><strong>Source</strong></td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Qur'an and Sunnah</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Magic, unknown words, shirk</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;"><strong>Help Sought From</strong></td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Allah alone</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Jinn, spirits, dead people</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;"><strong>Methods Used</strong></td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Clear Qur'anic verses, authentic duas</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Charms, amulets, horoscopes, sacrifices</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;"><strong>Islamic Ruling</strong></td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Permissible and encouraged</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Completely forbidden (Haram)</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #dee2e6; padding: 12px;"><strong>Result</strong></td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Blessing, healing, closeness to Allah</td>
                        <td style="border: 1px solid #dee2e6; padding: 12px;">Sin, destruction, distance from Allah</td>
                    </tr>
                </tbody>
            </table>
            
            <h2>Conclusion</h2>
            
            <p>Every Muslim must be vigilant and ensure they only practice or seek <strong>Ruqyah Shar'iyyah</strong> - the permissible Islamic healing method that relies solely on Allah (SWT).</p>
            
            <p>Avoid at all costs any practice that involves shirk, magic, or seeking help from other than Allah. Remember, true healing and protection come only from Allah, the Most Merciful, the Most Compassionate.</p>
            
            <blockquote>
            <p><strong>"And when I am ill, it is He who cures me"</strong> (Ash-Shu'ara: 80)</p>
            </blockquote>
            """,
            "category": "Education",
            "author": "Ruqyah Healing Hub",
            "read_time": 15,
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=1)
        }
    ]
    
    for article_data in articles_data:
        existing = db.query(Article).filter(Article.slug == article_data["slug"]).first()
        
        if not existing:
            article = Article(
                id=str(uuid.uuid4()),
                **article_data
            )
            db.add(article)
    
    print("  ✅ Articles seeded")


def seed_podcasts(db):
    """Seed podcasts."""
    print("🎙️  Seeding podcasts...")
    
    podcasts_data = [
        {
            "title": "Introduction to Ruqya",
            "description": "A comprehensive introduction to Islamic spiritual healing and the importance of Ruqya in a Muslim's life.",
            "duration": 1800,  # 30 minutes
            "audio_url": "/uploads/podcasts/intro-to-ruqya.mp3",
            "cover_image": "/uploads/images/podcast-intro.jpg",
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=20)
        },
        {
            "title": "Protection from Evil Eye",
            "description": "Learn the authentic Islamic methods to protect yourself and your family from the evil eye.",
            "duration": 2100,  # 35 minutes
            "audio_url": "/uploads/podcasts/evil-eye-protection.mp3",
            "cover_image": "/uploads/images/podcast-evil-eye.jpg",
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=15)
        },
        {
            "title": "Understanding Black Magic",
            "description": "Deep dive into the reality of black magic in Islam and how to recognize and treat it.",
            "duration": 2400,  # 40 minutes
            "audio_url": "/uploads/podcasts/black-magic.mp3",
            "cover_image": "/uploads/images/podcast-sihr.jpg",
            "is_published": True,
            "published_at": datetime.utcnow() - timedelta(days=10)
        }
    ]
    
    for podcast_data in podcasts_data:
        existing = db.query(Podcast).filter(Podcast.title == podcast_data["title"]).first()
        
        if not existing:
            podcast = Podcast(
                id=str(uuid.uuid4()),
                **podcast_data
            )
            db.add(podcast)
    
    print("  ✅ Podcasts seeded")


def seed_audio(db):
    """Seed audio files."""
    print("🔊 Seeding audio files...")
    
    audio_data = [
        {
            "title": "Surah Al-Baqarah",
            "reciter": "Sheikh Mishary Rashid",
            "description": "Complete recitation of Surah Al-Baqarah for protection and healing",
            "category": "General Ruqya",
            "duration": 8400,  # 140 minutes
            "audio_url": "/uploads/audio/surah-baqarah.mp3",
            "is_published": True
        },
        {
            "title": "Ayat Al-Kursi",
            "reciter": "Sheikh Mishary Rashid",
            "description": "The greatest verse of the Quran, essential for daily protection",
            "category": "General Ruqya",
            "duration": 120,  # 2 minutes
            "audio_url": "/uploads/audio/ayat-kursi.mp3",
            "is_published": True
        },
        {
            "title": "Ruqyah for Evil Eye",
            "reciter": "Sheikh Ahmad Al-Ajmi",
            "description": "Specific Quranic verses and duas for treating evil eye",
            "category": "Evil Eye",
            "duration": 1800,  # 30 minutes
            "audio_url": "/uploads/audio/ruqya-evil-eye.mp3",
            "is_published": True
        },
        {
            "title": "Ruqyah for Black Magic",
            "reciter": "Sheikh Ahmad Al-Ajmi",
            "description": "Powerful Ruqya specifically for breaking black magic",
            "category": "Black Magic",
            "duration": 2700,  # 45 minutes
            "audio_url": "/uploads/audio/ruqya-sihr.mp3",
            "is_published": True
        },
        {
            "title": "Ruqyah for Jinn",
            "reciter": "Sheikh Saad Al-Ghamdi",
            "description": "Complete Ruqya treatment for jinn possession",
            "category": "Jinn",
            "duration": 3600,  # 60 minutes
            "audio_url": "/uploads/audio/ruqya-jinn.mp3",
            "is_published": True
        },
        {
            "title": "Morning Adhkar",
            "reciter": "Sheikh Mishary Rashid",
            "description": "Morning remembrance for daily protection",
            "category": "General Ruqya",
            "duration": 900,  # 15 minutes
            "audio_url": "/uploads/audio/morning-adhkar.mp3",
            "is_published": True
        },
        {
            "title": "Evening Adhkar",
            "reciter": "Sheikh Mishary Rashid",
            "description": "Evening remembrance for nighttime protection",
            "category": "General Ruqya",
            "duration": 900,  # 15 minutes
            "audio_url": "/uploads/audio/evening-adhkar.mp3",
            "is_published": True
        }
    ]
    
    for audio_item in audio_data:
        existing = db.query(Audio).filter(Audio.title == audio_item["title"]).first()
        
        if not existing:
            audio = Audio(
                id=str(uuid.uuid4()),
                **audio_item
            )
            db.add(audio)
    
    print("  ✅ Audio files seeded")


def seed_products(db):
    """Seed products."""
    print("🛒 Seeding products...")
    
    products_data = [
        {
            "name": "Ruqyah Water (Ma'u shifa)",
            "description": "Blessed water recited with powerful Quranic verses for spiritual healing and protection. Use for drinking, bathing, and home purification. Made with pure water and blessed with authentic Islamic recitations.",
            "price": 5000.00,
            "stock_quantity": 100,
            "image": "https://images.pexels.com/photos/416528/pexels-photo-416528.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Honey",
            "description": "Pure natural honey infused with Quranic recitation. The Prophet (peace be upon him) said: 'Make good use of the two cures: honey and the Qur'ān.' Take daily for health, healing, and spiritual protection.",
            "price": 20000.00,
            "stock_quantity": 50,
            "image": "https://images.pexels.com/photos/33242/honey-sweet-syrup-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Olive Oil",
            "description": "Extra virgin olive oil blessed with powerful Quranic verses. Use for massage, cooking, or apply on affected areas during Ruqya treatment. Known for its healing and protective properties.",
            "price": 10000.00,
            "stock_quantity": 75,
            "image": "https://images.pexels.com/photos/33783/olive-oil-salad-dressing-cooking-olive.jpg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Oil",
            "description": "Special therapeutic blend of blessed oils with Quranic recitation. Contains black seed oil, olive oil, and healing herbs. Apply on body for protection and healing from spiritual ailments and physical pain.",
            "price": 10000.00,
            "stock_quantity": 80,
            "image": "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Bakhoor",
            "description": "Premium Arabian incense blessed with Quranic verses. Made from natural agarwood and aromatic resins. Burn in your home to purify the environment, drive away evil spirits, and create a peaceful atmosphere.",
            "price": 10000.00,
            "stock_quantity": 60,
            "image": "https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Brain Booster",
            "description": "Natural herbal supplement with Quranic blessings to enhance memory, focus, and mental clarity. Contains brain-boosting herbs and vitamins. Perfect for students, professionals, and anyone seeking improved cognitive function.",
            "price": 20000.00,
            "stock_quantity": 40,
            "image": "https://images.pexels.com/photos/3683041/pexels-photo-3683041.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Infection Treatment (Men & Women)",
            "description": "Islamic herbal remedy for treating various infections naturally. Blessed with Quranic verses for enhanced healing. Made from authentic natural ingredients. Suitable for both men and women.",
            "price": 10000.00,
            "stock_quantity": 50,
            "image": "https://images.pexels.com/photos/3873146/pexels-photo-3873146.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Hair Cream",
            "description": "Nourishing hair cream infused with natural ingredients and Quranic blessings. Promotes healthy hair growth, prevents hair loss, and provides scalp protection. Made with natural oils and herbs.",
            "price": 10000.00,
            "stock_quantity": 70,
            "image": "https://images.pexels.com/photos/7428100/pexels-photo-7428100.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Soap",
            "description": "Handmade soap with natural ingredients blessed with Quranic recitation. Contains black seed, sidr leaves, olive oil, and ZamZam water. Cleanses body and provides spiritual purification for daily use.",
            "price": 5000.00,
            "stock_quantity": 120,
            "image": "https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Spray",
            "description": "Blessed water spray for instant spiritual protection. Contains Quranic verses and natural fragrance. Spray in your home, car, office, or on yourself for spiritual cleansing and protection against negative energies.",
            "price": 5000.00,
            "stock_quantity": 90,
            "image": "https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Ruqyah Protection Special Package",
            "description": "Complete protection package for comprehensive spiritual defense. Includes blessed water (1L), blessed oil (250ml), premium bakhoor, protection spray, special duas booklet, and treatment guide. Everything you need for complete spiritual protection and home purification.",
            "price": 200000.00,
            "stock_quantity": 15,
            "image": "https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg?auto=compress&cs=tinysrgb&w=800"
        },
        {
            "name": "Sihir/Black Magic Treatment Package",
            "description": "Intensive treatment package specifically designed for breaking black magic (sihr) and jinn afflictions. Includes specialized blessed oils, Ruqya water (2L), powerful bakhoor, black seed products, sidr leaves, and detailed step-by-step treatment instructions with 30-day program.",
            "price": 150000.00,
            "stock_quantity": 20,
            "image": "https://images.pexels.com/photos/4021775/pexels-photo-4021775.jpeg?auto=compress&cs=tinysrgb&w=800"
        }
    ]
    
    for product_data in products_data:
        existing = db.query(Product).filter(Product.name == product_data["name"]).first()
        
        if not existing:
            product = Product(
                id=str(uuid.uuid4()),
                **product_data
            )
            db.add(product)
    
    print("  ✅ Products seeded")


def main():
    """Main seeding function."""
    print("\n" + "="*60)
    print("🌱 SEEDING DATABASE")
    print("="*60 + "\n")
    
    db = SessionLocal()
    
    try:
        seed_users(db)
        seed_services(db)
        seed_articles(db)
        seed_podcasts(db)
        seed_audio(db)
        seed_products(db)
        
        db.commit()
        
        print("\n" + "="*60)
        print("✅ DATABASE SEEDED SUCCESSFULLY!")
        print("="*60)
        print("\n📊 Summary:")
        print(f"  • Users: {db.query(User).count()}")
        print(f"  • Services: {db.query(Service).count()}")
        print(f"  • Articles: {db.query(Article).count()}")
        print(f"  • Podcasts: {db.query(Podcast).count()}")
        print(f"  • Audio Files: {db.query(Audio).count()}")
        print(f"  • Products: {db.query(Product).count()}")
        print("\n🔑 Admin Credentials:")
        print("  • Email: admin@ruqyahealinghub.com")
        print("  • Password: admin123")
        print("\n⚠️  Please change the admin password after first login!")
        print("="*60 + "\n")
        
    except Exception as e:
        print(f"\n❌ Error seeding database: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    main()
