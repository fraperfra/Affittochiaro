const projectId = 'prj_1VIZTccAtEWRRXbGQK4wJlhaPI9g'; // il tuo ID progetto
const teamID = undefined; // oppure 'team_xxxxx' se il progetto è di un team

const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('VERCEL_TOKEN non impostato');
  process.exit(1);
}

async function run() {
  const route = teamID
    ? `${projectId}/pause?teamID=${teamID}`
    : `${projectId}/pause`;

  const res = await fetch(`https://api.vercel.com/v1/projects/${route}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    const text = await res.text();
    console.error('Errore Vercel:', res.status, res.statusText, text);
    process.exit(1);
  }

  console.log('Progetto messo in pausa con successo');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});