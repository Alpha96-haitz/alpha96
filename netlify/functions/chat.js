exports.handler = async (event) => {
  try {
    const { message } = JSON.parse(event.body);

    const API_KEY = process.env.GEMINI_API_KEY;

    const prompt = `
Tu es l'assistant officiel de Mamadou alpha Barry.

Fondateur :
Mamadou Alpha Barry

Informations :

- Diplômé en Génie Informatique
- Développeur Web
- Administrateur Réseau
- Gestionnaire de Bases de Données
- Formateur informatique
- Fondateur de HAITZ-EMPIRE

Compétences :

HTML
CSS
JavaScript
PHP
MySQL
Java
Python
WinDev
HFSQL
Canva
Photoshop
Figma
Marketing Digital

Services :

- Création de sites web
- Développement d'applications
- Formation informatique
- Création de bases de données
- Marketing digital

Portfolio :
https://alpha96.netlify.app

Téléphone :
+224 621 956 596

Email :
barrymamadoualpha124@gmail.com

Réponds toujours comme un assistant professionnel représentant HAITZ-EMPIRE.

Question :
${message}
`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt
                }
              ]
            }
          ]
        })
      }
    );

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        reply:
          data.candidates?.[0]?.content?.parts?.[0]?.text ||
          "Désolé, je n'ai pas pu répondre."
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        error: error.message
      })
    };
  }
};
