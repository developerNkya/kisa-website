export const adminStats = [
{ label: 'Watumiaji', value: '10,248', delta: '+8.4%', up: true },
{ label: 'Subscribers', value: '4,821', delta: '+12.1%', up: true },
{ label: 'Mapato (mwezi)', value: 'TZS 9,642,000', delta: '+9.7%', up: true },
{ label: 'Stories', value: '342', delta: '+6', up: true },
{ label: 'Episodes', value: '2,184', delta: '+94', up: true }];


export const growthSeries = [
{ month: 'Feb', users: 4200, subscribers: 1420, revenue: 2840000 },
{ month: 'Mac', users: 5100, subscribers: 1880, revenue: 3760000 },
{ month: 'Apr', users: 6050, subscribers: 2410, revenue: 4820000 },
{ month: 'Mei', users: 7180, subscribers: 3020, revenue: 6040000 },
{ month: 'Jun', users: 8340, subscribers: 3640, revenue: 7280000 },
{ month: 'Jul', users: 9310, subscribers: 4280, revenue: 8560000 },
{ month: 'Ago', users: 10248, subscribers: 4821, revenue: 9642000 }];


export const readingSeries = [
{ day: 'Jumatatu', minutes: 41200, views: 18400 },
{ day: 'Jumanne', minutes: 38900, views: 17100 },
{ day: 'Jumatano', minutes: 44300, views: 19800 },
{ day: 'Alhamisi', minutes: 51800, views: 23600 },
{ day: 'Ijumaa', minutes: 62400, views: 29100 },
{ day: 'Jumamosi', minutes: 71900, views: 34200 },
{ day: 'Jumapili', minutes: 68100, views: 31700 }];


export const categorySplit = [
{ name: 'Mapenzi', value: 38 },
{ name: 'Drama', value: 24 },
{ name: 'Siri', value: 18 },
{ name: 'Thriller', value: 11 },
{ name: 'Vijana', value: 9 }];


export const retentionSeries = [
{ week: 'W1', retained: 100 },
{ week: 'W2', retained: 74 },
{ week: 'W3', retained: 61 },
{ week: 'W4', retained: 54 },
{ week: 'W5', retained: 49 },
{ week: 'W6', retained: 46 }];


export type AdminStoryStatus = 'Published' | 'Draft' | 'Scheduled';

export const adminStories: {
  id: string;
  title: string;
  category: string;
  episodes: number;
  status: AdminStoryStatus;
  views: number;
  created: string;
}[] = [
{ id: 'ST-1042', title: 'Siri ya Amina', category: 'Mapenzi', episodes: 24, status: 'Published', views: 184000, created: '12 Jan 2026' },
{ id: 'ST-1043', title: 'Chumba cha 404', category: 'Siri', episodes: 11, status: 'Published', views: 132000, created: '2 Feb 2026' },
{ id: 'ST-1044', title: 'Ahadi ya Mwisho', category: 'Mapenzi', episodes: 20, status: 'Published', views: 143800, created: '14 Jun 2025' },
{ id: 'ST-1051', title: 'Mgeni wa Usiku', category: 'Drama', episodes: 2, status: 'Published', views: 9800, created: '6 Ago 2026' },
{ id: 'ST-1052', title: 'Kivuli cha Bahari', category: 'Adventure', episodes: 12, status: 'Published', views: 52700, created: '8 Mei 2026' },
{ id: 'ST-1060', title: 'Njia ya Kilimanjaro', category: 'Adventure', episodes: 0, status: 'Draft', views: 0, created: '9 Ago 2026' },
{ id: 'ST-1061', title: 'Bibi Harusi wa Tanga', category: 'Mapenzi', episodes: 4, status: 'Scheduled', views: 0, created: '11 Ago 2026' },
{ id: 'ST-1062', title: 'Sauti ya Mvua', category: 'Drama', episodes: 1, status: 'Draft', views: 0, created: '12 Ago 2026' }];


export const adminEpisodes = [
{ id: 'EP-8801', story: 'Siri ya Amina', number: 18, title: 'Hofu', minutes: 11, access: 'Premium', status: 'Published', date: '10 Ago 2026' },
{ id: 'EP-8802', story: 'Siri ya Amina', number: 19, title: 'Ndoto Mbaya', minutes: 9, access: 'Premium', status: 'Scheduled', date: '17 Ago 2026' },
{ id: 'EP-8803', story: 'Chumba cha 404', number: 11, title: 'Mlango wa Nne', minutes: 12, access: 'Premium', status: 'Published', date: '12 Ago 2026' },
{ id: 'EP-8804', story: 'Mgeni wa Usiku', number: 3, title: 'Deni', minutes: 8, access: 'Free', status: 'Draft', date: '—' },
{ id: 'EP-8805', story: 'Nyota ya Kigamboni', number: 9, title: 'Alfajiri', minutes: 10, access: 'Free', status: 'Scheduled', date: '18 Ago 2026' }];


export const adminUsers = [
{ name: 'Amina Hassan', phone: '+255 712 445 991', joined: '4 Jan 2026', plan: 'Premium', expiry: '31 Ago 2026', status: 'Active' },
{ name: 'Grace Mwakalinga', phone: '+255 754 220 118', joined: '18 Feb 2026', plan: 'Premium', expiry: '18 Ago 2026', status: 'Expiring' },
{ name: 'Baraka Joseph', phone: '+255 688 771 042', joined: '9 Mac 2026', plan: 'Free', expiry: '—', status: 'Expired' },
{ name: 'Zuhura Ally', phone: '+255 745 909 336', joined: '22 Apr 2026', plan: 'Premium', expiry: '22 Sep 2026', status: 'Active' },
{ name: 'Neema Kimaro', phone: '+255 762 118 470', joined: '3 Mei 2026', plan: 'Premium', expiry: '16 Ago 2026', status: 'Expiring' },
{ name: 'Said Mwinyi', phone: '+255 715 663 220', joined: '27 Mei 2026', plan: 'Free', expiry: '—', status: 'Expired' },
{ name: 'Halima Sued', phone: '+255 784 552 901', joined: '14 Jun 2026', plan: 'Premium', expiry: '14 Sep 2026', status: 'Active' }];


export const adminPayments = [
{ id: 'TX-99120', user: 'Amina Hassan', amount: 2000, date: '12 Ago 2026 · 21:14', method: 'M-Pesa', status: 'Successful' },
{ id: 'TX-99121', user: 'Zuhura Ally', amount: 2000, date: '12 Ago 2026 · 20:48', method: 'Airtel Money', status: 'Successful' },
{ id: 'TX-99122', user: 'Baraka Joseph', amount: 2000, date: '12 Ago 2026 · 19:02', method: 'Mixx by Yas', status: 'Failed' },
{ id: 'TX-99123', user: 'Neema Kimaro', amount: 2000, date: '12 Ago 2026 · 18:33', method: 'M-Pesa', status: 'Pending' },
{ id: 'TX-99124', user: 'Grace Mwakalinga', amount: 2000, date: '12 Ago 2026 · 17:57', method: 'HaloPesa', status: 'Successful' },
{ id: 'TX-99125', user: 'Halima Sued', amount: 2000, date: '12 Ago 2026 · 16:20', method: 'Kadi ya Benki', status: 'Successful' }];


export const subscriptionBuckets = [
{ label: 'Active', value: 4821, tone: 'green' as const },
{ label: 'Expiring soon', value: 612, tone: 'gold' as const },
{ label: 'Expired', value: 1184, tone: 'red' as const },
{ label: 'Renewed (mwezi)', value: 3472, tone: 'green' as const },
{ label: 'Cancelled', value: 208, tone: 'neutral' as const }];


export const topStories = [
{ title: 'Siri ya Amina', views: 184000, completion: 78 },
{ title: 'Ahadi ya Mwisho', views: 143800, completion: 84 },
{ title: 'Chumba cha 404', views: 132000, completion: 71 },
{ title: 'Moyo wa Mwisho', views: 121500, completion: 66 },
{ title: 'Mgeni Asiyejulikana', views: 88900, completion: 63 }];


export const analyticsKpis = [
{ label: 'Daily active users', value: '3,142', delta: '+4.2%' },
{ label: 'Monthly active users', value: '18,904', delta: '+11.6%' },
{ label: 'New registrations', value: '938', delta: '+7.1%' },
{ label: 'Paid subscribers', value: '4,821', delta: '+12.1%' },
{ label: 'Conversion rate', value: '25.5%', delta: '+1.8%' },
{ label: 'Renewal rate', value: '72%', delta: '+3.4%' },
{ label: 'Avg reading time', value: 'Dakika 34', delta: '+2 dk' },
{ label: 'Episode completion', value: '81%', delta: '+2.6%' }];