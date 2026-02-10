import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export const generateTenantPitch = async (userData: {
  name: string;
  job: string;
  reason: string;
  hobbies: string;
}) => {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Sei un copywriter esperto in affitti immobiliari in Italia. Scrivi pitch di presentazione professionali, affidabili e calorosi. Rispondi sempre in italiano.',
        },
        {
          role: 'user',
          content: `Aiutami a scrivere un pitch di presentazione accattivante per un proprietario di casa. Mi chiamo ${userData.name}, lavoro come ${userData.job}. Cerco casa perché ${userData.reason}. Nel tempo libero mi piace ${userData.hobbies}. Il tono deve essere professionale, affidabile ma caloroso. Massimo 3 frasi.`,
        },
      ],
      temperature: 0.7,
      max_tokens: 200,
    });

    return response.choices[0]?.message?.content || 'Ciao, sono un inquilino affidabile e interessato al tuo immobile.';
  } catch (error) {
    console.error('Error generating pitch:', error);
    return 'Ciao, sono un inquilino affidabile e interessato al tuo immobile. Sarei felice di conoscerci per una visita.';
  }
};
