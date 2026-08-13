import { Episode, Story } from '../types';

const TITLE_POOL = [
'Ujumbe wa Usiku',
'Mgeni',
'Siri',
'Ukweli',
'Kivuli',
'Ahadi',
'Mtego',
'Simu ya Saa Tatu',
'Barua',
'Njia Panda',
'Dhoruba',
'Mkutano',
'Uongo Mtamu',
'Alfajiri',
'Kilio',
'Nyayo',
'Mlango wa Nne',
'Hofu',
'Ndoto Mbaya',
'Chumba cha Giza',
'Machozi ya Mama',
'Uamuzi',
'Rafiki au Adui',
'Damu',
'Ukweli Mchungu',
'Msamaha',
'Kurudi',
'Nuru',
'Mwisho wa Safari',
'Baada ya Yote'];


const MINUTES = [8, 10, 9, 12, 11, 9, 13, 8, 10, 12, 9, 11];

function buildEpisodes(
storyId: string,
count: number,
freeCount: number,
firstDate: string,
offset = 0)
: Episode[] {
  const start = new Date(firstDate).getTime();
  const week = 7 * 24 * 60 * 60 * 1000;
  return Array.from({ length: count }, (_, i) => {
    const number = i + 1;
    return {
      id: `${storyId}-e${number}`,
      number,
      title: TITLE_POOL[(i + offset) % TITLE_POOL.length],
      readingMinutes: MINUTES[i % MINUTES.length],
      publishedAt: new Date(start + i * week).toISOString(),
      premium: number > freeCount
    };
  });
}

export const stories: Story[] = [
{
  id: 'siri-ya-amina',
  slug: 'siri-ya-amina',
  title: 'Siri ya Amina',
  hook: 'Alijua alikuwa anadanganywa. Hakujua ni kwa nini.',
  description:
  'Amina alifikiri maisha yake yalikuwa yameanza kuwa sawa, mpaka siku alipogundua ujumbe ambao haukupaswa kuonekana. Ndani ya wiki mbili, kila kitu alichokiamini kuhusu mume wake, rafiki yake wa karibu na familia yake kilianza kubomoka. Hadithi ya mapenzi, uongo na maamuzi magumu katika mitaa ya Dar es Salaam.',
  cover: "/965aea92-0be5-4909-9832-90962378cc8f.jpg",
  author: 'Zawadi Mchome',
  genres: ['Mapenzi', 'Drama'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: true,
  isNew: false,
  rating: 4.8,
  reads: 184000,
  releasedAt: '2026-01-12',
  tags: ['#Mapenzi', '#Drama', '#Siri', '#Tanzania'],
  episodes: buildEpisodes('siri-ya-amina', 24, 3, '2026-01-12')
},
{
  id: 'chumba-cha-404',
  slug: 'chumba-cha-404',
  title: 'Chumba cha 404',
  hook: 'Usifungue mlango wa nne.',
  description:
  'Hoteli ndogo pembeni ya barabara ya Morogoro ina kanuni moja tu: hakuna anayelala chumba cha 404. Pale mgeni mmoja anapopuuza kanuni hiyo, wafanyakazi wanaanza kutoweka mmoja baada ya mwingine. KISA Original inayochanganya siri, hofu na ukweli wa kutisha.',
  cover: "/d5373c19-3082-476c-95dc-598e80054157.jpg",
  author: 'Juma Kilonzo',
  genres: ['Siri', 'Horror'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: true,
  isNew: false,
  rating: 4.7,
  reads: 132000,
  releasedAt: '2026-02-02',
  tags: ['#Siri', '#Horror', '#KISAOriginal', '#Tanzania'],
  episodes: buildEpisodes('chumba-cha-404', 11, 2, '2026-02-02', 16)
},
{
  id: 'moyo-wa-mwisho',
  slug: 'moyo-wa-mwisho',
  title: 'Moyo wa Mwisho',
  hook: 'Alimpenda kwa miaka saba. Aliondoka kwa dakika saba.',
  description:
  'Neema na Baraka walikuwa hadithi ya mapenzi ambayo kila mtu Kigamboni aliitaka. Lakini siri moja ya zamani inarudi kudai deni lake, na wote wawili wanalazimika kuchagua kati ya mapenzi na heshima ya familia zao.',
  cover: "/837cfb19-b0d6-450d-a3ea-dbd7fa3f0aa2.jpg",
  author: 'Aisha Rajabu',
  genres: ['Mapenzi', 'Drama'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.6,
  reads: 121500,
  releasedAt: '2025-11-20',
  tags: ['#Mapenzi', '#Drama', '#Familia'],
  episodes: buildEpisodes('moyo-wa-mwisho', 23, 3, '2025-11-20', 5)
},
{
  id: 'mgeni-wa-usiku',
  slug: 'mgeni-wa-usiku',
  title: 'Mgeni wa Usiku',
  hook: 'Aligonga mlango saa nane usiku. Alijua jina la kila mtu ndani.',
  description:
  'Familia ya Mzee Shaibu inapokea mgeni ambaye hakutangaziwa. Anajua mambo ambayo hakuna mtu wa nje anayepaswa kuyajua, na anasema amekuja kulipa deni la mwaka 1998.',
  cover: "/2cfbef07-4094-410d-8f52-55bda8397922.jpg",
  author: 'Peter Mwanga',
  genres: ['Drama', 'Siri'],
  status: 'Inaendelea',
  premium: false,
  isOriginal: false,
  isNew: true,
  rating: 4.5,
  reads: 9800,
  releasedAt: '2026-08-06',
  tags: ['#Drama', '#Siri', '#Mpya'],
  episodes: buildEpisodes('mgeni-wa-usiku', 2, 2, '2026-08-06', 1)
},
{
  id: 'mapenzi-ya-dar',
  slug: 'mapenzi-ya-dar',
  title: 'Mapenzi ya Dar',
  hook: 'Jiji lenye watu milioni sita, na yeye alimkuta mara tatu kwa siku moja.',
  description:
  'Hadithi ya bodaboda, msongamano wa Ubungo, na msichana mmoja anayeamini kwamba mapenzi ya kweli huja pale unapokuwa umechoka kuyatafuta.',
  cover: "/c660e36e-f4f9-4a75-9261-5e20009289c2.jpg",
  author: 'Halima Sued',
  genres: ['Mapenzi', 'Vijana'],
  status: 'Inaendelea',
  premium: false,
  isOriginal: false,
  isNew: false,
  rating: 4.4,
  reads: 76400,
  releasedAt: '2026-03-15',
  tags: ['#Mapenzi', '#Vijana', '#DarEsSalaam'],
  episodes: buildEpisodes('mapenzi-ya-dar', 16, 16, '2026-03-15', 8)
},
{
  id: 'ujumbe-wa-usiku',
  slug: 'ujumbe-wa-usiku',
  title: 'Ujumbe wa Usiku',
  hook: 'Kila saa tisa usiku, simu yake inaita. Hakuna anayejibu.',
  description:
  'Mwalimu kijana anapoanza kupokea ujumbe kutoka namba isiyojulikana, anagundua kwamba mtu anayemtumia anajua kila hatua anayoipiga.',
  cover: "/86556655-9fdc-4e70-80f2-1312cc27dfce.jpg",
  author: 'Juma Kilonzo',
  genres: ['Thriller', 'Siri'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: false,
  isNew: true,
  rating: 4.6,
  reads: 41200,
  releasedAt: '2026-07-24',
  tags: ['#Thriller', '#Siri', '#Mpya'],
  episodes: buildEpisodes('ujumbe-wa-usiku', 9, 2, '2026-07-24', 7)
},
{
  id: 'mgeni-asiyejulikana',
  slug: 'mgeni-asiyejulikana',
  title: 'Mgeni Asiyejulikana',
  hook: 'Mkoba wake ulikuwa pale. Yeye hakuwa.',
  description:
  'Polisi wa Kariakoo wanapata chumba kimoja tupu, mkoba wa mwanamke na hakuna alama ya kuvunjwa. Upelelezi unaanza kufumbua mtandao ambao hakuna aliyeutarajia.',
  cover: "/cc60fc4c-bbef-410d-b283-ff249c214508.jpg",
  author: 'Fatuma Ngonyani',
  genres: ['Siri', 'Thriller'],
  status: 'Imekamilika',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.5,
  reads: 88900,
  releasedAt: '2025-09-04',
  tags: ['#Siri', '#Upelelezi', '#Kariakoo'],
  episodes: buildEpisodes('mgeni-asiyejulikana', 14, 2, '2025-09-04', 2)
},
{
  id: 'baada-ya-mvua',
  slug: 'baada-ya-mvua',
  title: 'Baada ya Mvua',
  hook: 'Mama alificha kitu kwa miaka ishirini. Mvua ikaifukua.',
  description:
  'Baada ya mafuriko ya Msimbazi, familia moja inalazimika kurudi kwenye nyumba ya zamani — na kwenye siri iliyozikwa chini yake.',
  cover: "/e6c2c998-d232-457a-8498-afa3e96a6ea9.jpg",
  author: 'Aisha Rajabu',
  genres: ['Drama', 'Maisha'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.7,
  reads: 64300,
  releasedAt: '2026-04-10',
  tags: ['#Drama', '#Familia', '#Siri'],
  episodes: buildEpisodes('baada-ya-mvua', 18, 3, '2026-04-10', 20)
},
{
  id: 'kivuli-cha-bahari',
  slug: 'kivuli-cha-bahari',
  title: 'Kivuli cha Bahari',
  hook: 'Dhow moja iliondoka Zanzibar na watu tisa. Ilirudi na wanane.',
  description:
  'Safari ya biashara kati ya Zanzibar na Bagamoyo inageuka kuwa upelelezi wa kifo, ahadi na hazina ambayo bahari haitaki kuiachia.',
  cover: "/8b45aad5-5980-462e-a114-6083b4ebe1c6.jpg",
  author: 'Said Mwinyi',
  genres: ['Adventure', 'Siri'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: true,
  isNew: false,
  rating: 4.6,
  reads: 52700,
  releasedAt: '2026-05-08',
  tags: ['#Adventure', '#Siri', '#Zanzibar'],
  episodes: buildEpisodes('kivuli-cha-bahari', 12, 2, '2026-05-08', 9)
},
{
  id: 'ahadi-ya-mwisho',
  slug: 'ahadi-ya-mwisho',
  title: 'Ahadi ya Mwisho',
  hook: 'Siku ya harusi, alipata barua kutoka kwa marehemu.',
  description:
  'Barua moja iliyofichwa kwa miaka mitano inamlazimu Zuhura kuchagua: kumaliza harusi yake, au kumaliza uongo ambao umeshikilia familia mbili.',
  cover: "/812e217e-3272-4cbb-aa10-f23f25ad5cc5.jpg",
  author: 'Zawadi Mchome',
  genres: ['Mapenzi', 'Drama'],
  status: 'Imekamilika',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.9,
  reads: 143800,
  releasedAt: '2025-06-14',
  tags: ['#Mapenzi', '#Drama', '#Harusi'],
  episodes: buildEpisodes('ahadi-ya-mwisho', 20, 3, '2025-06-14', 4)
},
{
  id: 'nyota-ya-kigamboni',
  slug: 'nyota-ya-kigamboni',
  title: 'Nyota ya Kigamboni',
  hook: 'Alikuwa wa kwanza katika familia yake kufika chuo. Hakuwa wa kwanza kuumizwa.',
  description:
  'Hadithi ya Mwajuma, mwanafunzi wa mwaka wa kwanza anayebeba matumaini ya mtaa mzima — na mzigo ambao hakuna anayeuona.',
  cover: "/3017038f-f9a5-42a9-bbed-e515e1ffdbf2.jpg",
  author: 'Halima Sued',
  genres: ['Vijana', 'Maisha'],
  status: 'Inaendelea',
  premium: false,
  isOriginal: false,
  isNew: true,
  rating: 4.3,
  reads: 18900,
  releasedAt: '2026-07-30',
  tags: ['#Vijana', '#Maisha', '#Chuo'],
  episodes: buildEpisodes('nyota-ya-kigamboni', 8, 8, '2026-07-30', 13)
},
{
  id: 'damu-na-dhahabu',
  slug: 'damu-na-dhahabu',
  title: 'Damu na Dhahabu',
  hook: 'Migodi ya Geita inatoa dhahabu. Inachukua kitu kingine.',
  description:
  'Kijana mmoja anaingia kwenye mgodi mdogo akitafuta pesa ya matibabu ya mama yake, na anajikuta kwenye mtandao wa udanganyifu, uhalifu na mauaji.',
  cover: "/d23fac30-e729-49d2-ae22-dbf45786ff28.jpg",
  author: 'Peter Mwanga',
  genres: ['Thriller', 'Drama'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.5,
  reads: 71200,
  releasedAt: '2026-02-19',
  tags: ['#Thriller', '#Geita', '#Uhalifu'],
  episodes: buildEpisodes('damu-na-dhahabu', 15, 2, '2026-02-19', 23)
},
{
  id: 'mwanafunzi',
  slug: 'mwanafunzi',
  title: 'Mwanafunzi',
  hook: 'Alisoma kwa taa ya simu. Alifaulu kwa siri ya mtu mwingine.',
  description:
  'Hadithi ya kijana wa Mbeya anayefika Dar kusoma, na uamuzi mmoja wa usiku mmoja unaobadilisha maisha yake yote.',
  cover: "/a480bf79-52b5-47a2-a8c7-30abe159d448.jpg",
  author: 'Said Mwinyi',
  genres: ['Vijana', 'Maisha'],
  status: 'Inaendelea',
  premium: false,
  isOriginal: false,
  isNew: false,
  rating: 4.2,
  reads: 34100,
  releasedAt: '2026-06-05',
  tags: ['#Vijana', '#Maisha', '#Mbeya'],
  episodes: buildEpisodes('mwanafunzi', 10, 10, '2026-06-05', 11)
},
{
  id: 'usiku-wa-dar',
  slug: 'usiku-wa-dar',
  title: 'Usiku wa Dar',
  hook: 'Jiji linalala. Yeye hana pa kulala.',
  description:
  'Dereva wa teksi wa usiku anaona kila kitu jijini — mpaka usiku anapopakia mteja ambaye hataki kutoka.',
  cover: "/ac994ad0-6c79-4a76-84b7-9b7973cb67ac.jpg",
  author: 'Fatuma Ngonyani',
  genres: ['Siri', 'Thriller'],
  status: 'Inaendelea',
  premium: true,
  isOriginal: false,
  isNew: false,
  rating: 4.6,
  reads: 59400,
  releasedAt: '2026-01-29',
  tags: ['#Siri', '#Usiku', '#DarEsSalaam'],
  episodes: buildEpisodes('usiku-wa-dar', 13, 2, '2026-01-29', 19)
},
{
  id: 'rafiki-wa-karibu',
  slug: 'rafiki-wa-karibu',
  title: 'Rafiki wa Karibu',
  hook: 'Alimwambia kila siri. Moja ilirudi kama kisu.',
  description:
  'Urafiki wa miaka kumi kati ya Neema na Grace unabomoka pale ujumbe mmoja unavuja — na wote wawili wanajua ni nani aliyeutuma.',
  cover: "/5f3a88ee-144b-4623-a754-c7794b3a552d.jpg",
  author: 'Zawadi Mchome',
  genres: ['Drama', 'Maisha'],
  status: 'Inaendelea',
  premium: false,
  isOriginal: false,
  isNew: true,
  rating: 4.4,
  reads: 22600,
  releasedAt: '2026-08-01',
  tags: ['#Drama', '#Urafiki', '#Mpya'],
  episodes: buildEpisodes('rafiki-wa-karibu', 7, 7, '2026-08-01', 25)
}];


export const featuredStory = stories[0];

export function getStory(slug?: string): Story | undefined {
  return stories.find((s) => s.slug === slug);
}

export function storiesByGenre(genre: string): Story[] {
  return stories.filter((s) => s.genres.includes(genre as Story['genres'][number]));
}

export const trendingStories = [
'siri-ya-amina',
'chumba-cha-404',
'ahadi-ya-mwisho',
'moyo-wa-mwisho',
'usiku-wa-dar',
'damu-na-dhahabu',
'baada-ya-mvua'].
map((id) => stories.find((s) => s.id === id)!) as Story[];

export const newStories = stories.filter((s) => s.isNew);
export const originals = stories.filter((s) => s.isOriginal);
export const freeStories = stories.filter((s) => !s.premium);

export const ongoingReleases = [
{ story: stories[0], episode: 18, emoji: '❤️' },
{ story: stories[1], episode: 11, emoji: '🔥' },
{ story: stories[2], episode: 23, emoji: '💔' },
{ story: stories[7], episode: 14, emoji: '🌧️' }];


export const authors = [
{ id: 'a1', name: 'Zawadi Mchome', stories: 3, reads: 352000, city: 'Dar es Salaam' },
{ id: 'a2', name: 'Juma Kilonzo', stories: 2, reads: 173000, city: 'Morogoro' },
{ id: 'a3', name: 'Aisha Rajabu', stories: 2, reads: 186000, city: 'Zanzibar' },
{ id: 'a4', name: 'Halima Sued', stories: 2, reads: 95000, city: 'Mwanza' },
{ id: 'a5', name: 'Said Mwinyi', stories: 2, reads: 86000, city: 'Tanga' },
{ id: 'a6', name: 'Peter Mwanga', stories: 2, reads: 81000, city: 'Arusha' },
{ id: 'a7', name: 'Fatuma Ngonyani', stories: 2, reads: 148000, city: 'Dodoma' }];


export const genres = [
'Zote',
'Mapenzi',
'Drama',
'Siri',
'Thriller',
'Adventure',
'Fantasy',
'Horror',
'Vijana',
'Maisha'] as
const;

export const categoryMeta: Record<
  string,
  {title: string;blurb: string;storyIds: string[];}> =
{
  Mapenzi: {
    title: 'Mapenzi',
    blurb: 'Hadithi za mapenzi, mahusiano, siri na hisia.',
    storyIds: ['siri-ya-amina', 'moyo-wa-mwisho', 'ahadi-ya-mwisho', 'mapenzi-ya-dar']
  },
  Drama: {
    title: 'Drama',
    blurb: 'Familia, mahusiano, uhaini na maamuzi magumu ya maisha.',
    storyIds: ['baada-ya-mvua', 'rafiki-wa-karibu', 'mgeni-wa-usiku', 'damu-na-dhahabu']
  },
  Siri: {
    title: 'Siri',
    blurb: 'Maswali yasiyo na majibu, na majibu ambayo huogopa kuyajua.',
    storyIds: ['chumba-cha-404', 'usiku-wa-dar', 'mgeni-asiyejulikana', 'kivuli-cha-bahari']
  },
  Thriller: {
    title: 'Thriller',
    blurb: 'Kasi, hatari na maamuzi ya sekunde moja.',
    storyIds: ['ujumbe-wa-usiku', 'damu-na-dhahabu', 'mgeni-asiyejulikana', 'usiku-wa-dar']
  },
  Adventure: {
    title: 'Adventure',
    blurb: 'Safari, bahari na maeneo ambayo ramani haiyaonyeshi.',
    storyIds: ['kivuli-cha-bahari', 'damu-na-dhahabu', 'mwanafunzi']
  },
  Fantasy: {
    title: 'Fantasy',
    blurb: 'Dunia nyingine, ndani ya dunia yetu.',
    storyIds: ['kivuli-cha-bahari', 'chumba-cha-404']
  },
  Horror: {
    title: 'Horror',
    blurb: 'Usisome usiku ukiwa peke yako.',
    storyIds: ['chumba-cha-404', 'usiku-wa-dar', 'mgeni-wa-usiku']
  },
  Vijana: {
    title: 'Vijana',
    blurb: 'Chuo, ndoto, marafiki na makosa ya kwanza.',
    storyIds: ['nyota-ya-kigamboni', 'mwanafunzi', 'mapenzi-ya-dar']
  },
  Maisha: {
    title: 'Maisha',
    blurb: 'Hadithi za kila siku, zinazogusa moyo.',
    storyIds: ['baada-ya-mvua', 'mwanafunzi', 'rafiki-wa-karibu', 'nyota-ya-kigamboni']
  }
};