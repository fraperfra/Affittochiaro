export interface Notification {
  id: number;
  name: string;
  action: string;
  location: string;
  time: string;
}

export const notificationsData: Notification[] = [
  { id: 1, name: 'Marco R.', action: 'ha verificato il suo profilo', location: 'BOLOGNA', time: '5 min fa' },
{ id: 2, name: 'Carla F.', action: 'è stata appena contattata da un\'agenzia', location: 'REGGIO EMILIA', time: 'proprio ora' },
{ id: 3, name: 'Giovanni C.', action: 'ha appena completato il suo CV', location: 'ROMA', time: '2 min fa' },
{ id: 4, name: 'Elena B.', action: 'ha trovato casa', location: 'TORINO', time: '10 min fa' },
{ id: 5, name: 'Luca M.', action: 'ha ricevuto 3 proposte', location: 'MILANO', time: '1 min fa' },
{ id: 6, name: 'Federica T.', action: 'ha caricato i documenti', location: 'MODENA', time: '7 min fa' },
{ id: 7, name: 'Alessandro P.', action: 'è stato contattato da un proprietario', location: 'PARMA', time: '3 min fa' },
{ id: 8, name: 'Martina L.', action: 'ha aggiornato il suo profilo', location: 'FIRENZE', time: '15 min fa' },
{ id: 9, name: 'Davide S.', action: 'ha completato la registrazione', location: 'BOLOGNA', time: 'proprio ora' },
{ id: 10, name: 'Chiara N.', action: 'ha trovato casa', location: 'REGGIO EMILIA', time: '12 min fa' },
{ id: 11, name: 'Roberto G.', action: 'ha ricevuto una proposta', location: 'VERONA', time: '4 min fa' },
{ id: 12, name: 'Giulia V.', action: 'è stata verificata', location: 'PADOVA', time: '8 min fa' },
{ id: 13, name: 'Stefano D.', action: 'ha appena completato il suo CV', location: 'MILANO', time: '6 min fa' },
{ id: 14, name: 'Francesca R.', action: 'è stata contattata da 2 agenzie', location: 'TORINO', time: '2 min fa' },
{ id: 15, name: 'Matteo B.', action: 'ha caricato le buste paga', location: 'ROMA', time: '9 min fa' },
{ id: 16, name: 'Sara C.', action: 'ha trovato casa', location: 'MODENA', time: '20 min fa' },
{ id: 17, name: 'Andrea F.', action: 'ha ricevuto 5 visualizzazioni', location: 'PARMA', time: '1 min fa' },
{ id: 18, name: 'Valentina M.', action: 'ha verificato il suo profilo', location: 'FIRENZE', time: '11 min fa' },
{ id: 19, name: 'Simone P.', action: 'è stato appena contattato', location: 'BOLOGNA', time: 'proprio ora' },
{ id: 20, name: 'Laura T.', action: 'ha completato la registrazione', location: 'REGGIO EMILIA', time: '5 min fa' },
];
