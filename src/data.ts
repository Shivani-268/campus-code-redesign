export type Challenge={id:string;title:string;type:string;theme:string;date:string;status:string;description:string;number:string};
export const challenges:Challenge[]=[
{id:'build-for-good',title:'Build for good',type:'HACKATHON',theme:'Social impact',date:'NOV 22 — 24',status:'OPEN',description:'Make everyday life a little better. Three days to build technology with people at its center.',number:'01'},
{id:'future-of-learning',title:'Future of learning',type:'DESIGN SPRINT',theme:'Education',date:'DEC 06 — 08',status:'OPEN',description:'Reimagine how the next generation discovers, shares and learns together.',number:'02'},
{id:'open-source-week',title:'Open source week',type:'COMMUNITY BUILD',theme:'Open source',date:'JAN 13 — 19',status:'SOON',description:'Find a project, meet your people and make your first contribution count.',number:'03'},
{id:'climate-code',title:'Climate code',type:'HACKATHON',theme:'Climate tech',date:'FEB 07 — 09',status:'SOON',description:'Use code, data and creativity to move the climate conversation forward.',number:'04'}];
export const nav=[['About','/about'],['Challenges','/challenges'],['Community','/community'],['Guides','/guides']];
