const projectId = 'prj_1VIZTccAtEWRRXbGQK4wJlhaPI9g'; // stesso ID

const token = process.env.VERCEL_TOKEN;

if (!token) {
  console.error('VERCEL_TOKEN non impostato');
  process.exit(1);
}

async function run() {
  const res = await fetch(`https://api.vercel.com/v1/projects/${projectId}/resume`, {
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

  console.log('Progetto riattivato con successo');
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});