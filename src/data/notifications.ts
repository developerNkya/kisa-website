import { KisaNotification, PaymentMethod } from '../types';

export const notifications: KisaNotification[] = [
{
  id: 'n1',
  kind: 'episode',
  title: 'Sehemu mpya imepatikana',
  body: 'Siri ya Amina — Sehemu ya 18 imetoka.',
  time: 'Dakika 12 zilizopita',
  cta: 'Soma sasa',
  href: '/soma/siri-ya-amina/18',
  unread: true
},
{
  id: 'n2',
  kind: 'subscription',
  title: 'Usajili wako unaisha karibuni',
  body: 'Usajili wako unaisha baada ya siku 5.',
  time: 'Saa 3 zilizopita',
  cta: 'Ongeza muda',
  href: '/malipo',
  unread: true
},
{
  id: 'n3',
  kind: 'episode',
  title: 'Chumba cha 404 — Sehemu ya 11',
  body: 'Mlango wa nne umefunguliwa. Sehemu mpya iko tayari.',
  time: 'Jana',
  cta: 'Soma sasa',
  href: '/hadithi/chumba-cha-404',
  unread: false
},
{
  id: 'n4',
  kind: 'system',
  title: 'Hadithi uliyohifadhi imekamilika',
  body: 'Ahadi ya Mwisho imefikia sehemu ya mwisho.',
  time: 'Siku 3 zilizopita',
  cta: 'Soma sasa',
  href: '/hadithi/ahadi-ya-mwisho',
  unread: false
}];


export const paymentMethods: PaymentMethod[] = [
{ id: 'mpesa', name: 'M-Pesa', hint: 'Vodacom · *150*00#', tone: 'green' },
{ id: 'airtel', name: 'Airtel Money', hint: 'Airtel · *150*60#', tone: 'red' },
{ id: 'mixx', name: 'Mixx by Yas', hint: 'Tigo Pesa · *150*01#', tone: 'blue' },
{ id: 'halopesa', name: 'HaloPesa', hint: 'Halotel · *150*88#', tone: 'gold' },
{ id: 'card', name: 'Kadi ya Benki', hint: 'Visa · Mastercard', tone: 'gold' }];


export const premiumBenefits = [
'Soma hadithi zote za Premium',
'Pata episodes mpya kila wiki',
'Hifadhi hadithi zako',
'Endelea ulipoishia',
'KISA Originals'];


export const suggestedSearches = [
'mapenzi',
'siri',
'Chumba cha 404',
'Zawadi Mchome',
'hadithi mpya',
'zilizokamilika'];