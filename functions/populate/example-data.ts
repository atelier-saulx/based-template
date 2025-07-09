// Example datasets based on the schema

// Users dataset (~50 items)
// export const users = [
//   {
//     name: 'Alice Johnson',
//     email: 'alice.johnson@email.com',
//     password: 'Pass123!',
//     role: 'admin',
//   },
//   {
//     name: 'Bob Smith',
//     email: 'bob.smith@email.com',
//     password: 'Secret456#',
//     role: 'viewer',
//   },
//   {
//     name: 'Charlie Brown',
//     email: 'charlie.brown@email.com',
//     password: 'MyPass789$',
//     role: 'viewer',
//   },
//   {
//     name: 'Diana Martinez',
//     email: 'diana.martinez@email.com',
//     password: 'Secure123%',
//     role: 'admin',
//   },
//   {
//     name: 'Edward Wilson',
//     email: 'edward.wilson@email.com',
//     password: 'Test456&',
//     role: 'viewer',
//   },
//   {
//     name: 'Fiona Davis',
//     email: 'fiona.davis@email.com',
//     password: 'Pass789*',
//     role: 'viewer',
//   },
//   {
//     name: 'George Miller',
//     email: 'george.miller@email.com',
//     password: 'Secret012!',
//     role: 'admin',
//   },
//   {
//     name: 'Hannah Taylor',
//     email: 'hannah.taylor@email.com',
//     password: 'MyPass345@',
//     role: 'viewer',
//   },
//   {
//     name: 'Ian Anderson',
//     email: 'ian.anderson@email.com',
//     password: 'Secure678#',
//     role: 'viewer',
//   },
//   {
//     name: 'Julia Thomas',
//     email: 'julia.thomas@email.com',
//     password: 'Test901$',
//     role: 'admin',
//   },
//   {
//     name: 'Kevin Jackson',
//     email: 'kevin.jackson@email.com',
//     password: 'Pass234%',
//     role: 'viewer',
//   },
//   {
//     name: 'Laura White',
//     email: 'laura.white@email.com',
//     password: 'Secret567&',
//     role: 'viewer',
//   },
//   {
//     name: 'Michael Harris',
//     email: 'michael.harris@email.com',
//     password: 'MyPass890*',
//     role: 'admin',
//   },
//   {
//     name: 'Nancy Martin',
//     email: 'nancy.martin@email.com',
//     password: 'Secure123!',
//     role: 'viewer',
//   },
//   {
//     name: 'Oliver Garcia',
//     email: 'oliver.garcia@email.com',
//     password: 'Test456@',
//     role: 'viewer',
//   },
//   {
//     name: 'Patricia Rodriguez',
//     email: 'patricia.rodriguez@email.com',
//     password: 'Pass789#',
//     role: 'admin',
//   },
//   {
//     name: 'Quentin Lewis',
//     email: 'quentin.lewis@email.com',
//     password: 'Secret012$',
//     role: 'viewer',
//   },
//   {
//     name: 'Rachel Walker',
//     email: 'rachel.walker@email.com',
//     password: 'MyPass345%',
//     role: 'viewer',
//   },
//   {
//     name: 'Samuel Hall',
//     email: 'samuel.hall@email.com',
//     password: 'Secure678&',
//     role: 'admin',
//   },
//   {
//     name: 'Tina Allen',
//     email: 'tina.allen@email.com',
//     password: 'Test901*',
//     role: 'viewer',
//   },
//   {
//     name: 'Ulysses Young',
//     email: 'ulysses.young@email.com',
//     password: 'Pass234!',
//     role: 'viewer',
//   },
//   {
//     name: 'Victoria King',
//     email: 'victoria.king@email.com',
//     password: 'Secret567@',
//     role: 'admin',
//   },
//   {
//     name: 'Walter Wright',
//     email: 'walter.wright@email.com',
//     password: 'MyPass890#',
//     role: 'viewer',
//   },
//   {
//     name: 'Xena Lopez',
//     email: 'xena.lopez@email.com',
//     password: 'Secure123$',
//     role: 'viewer',
//   },
//   {
//     name: 'Yasmine Hill',
//     email: 'yasmine.hill@email.com',
//     password: 'Test456%',
//     role: 'admin',
//   },
//   {
//     name: 'Zachary Scott',
//     email: 'zachary.scott@email.com',
//     password: 'Pass789&',
//     role: 'viewer',
//   },
//   {
//     name: 'Amy Green',
//     email: 'amy.green@email.com',
//     password: 'Secret012*',
//     role: 'viewer',
//   },
//   {
//     name: 'Brian Adams',
//     email: 'brian.adams@email.com',
//     password: 'MyPass345!',
//     role: 'admin',
//   },
//   {
//     name: 'Catherine Baker',
//     email: 'catherine.baker@email.com',
//     password: 'Secure678@',
//     role: 'viewer',
//   },
//   {
//     name: 'Daniel Nelson',
//     email: 'daniel.nelson@email.com',
//     password: 'Test901#',
//     role: 'viewer',
//   },
//   {
//     name: 'Emma Carter',
//     email: 'emma.carter@email.com',
//     password: 'Pass234$',
//     role: 'admin',
//   },
//   {
//     name: 'Frank Mitchell',
//     email: 'frank.mitchell@email.com',
//     password: 'Secret567%',
//     role: 'viewer',
//   },
//   {
//     name: 'Grace Perez',
//     email: 'grace.perez@email.com',
//     password: 'MyPass890&',
//     role: 'viewer',
//   },
//   {
//     name: 'Henry Roberts',
//     email: 'henry.roberts@email.com',
//     password: 'Secure123*',
//     role: 'admin',
//   },
//   {
//     name: 'Isabella Turner',
//     email: 'isabella.turner@email.com',
//     password: 'Test456!',
//     role: 'viewer',
//   },
//   {
//     name: 'Jack Phillips',
//     email: 'jack.phillips@email.com',
//     password: 'Pass789@',
//     role: 'viewer',
//   },
//   {
//     name: 'Karen Campbell',
//     email: 'karen.campbell@email.com',
//     password: 'Secret012#',
//     role: 'admin',
//   },
//   {
//     name: 'Leo Parker',
//     email: 'leo.parker@email.com',
//     password: 'MyPass345$',
//     role: 'viewer',
//   },
//   {
//     name: 'Mia Evans',
//     email: 'mia.evans@email.com',
//     password: 'Secure678%',
//     role: 'viewer',
//   },
//   {
//     name: 'Nathan Edwards',
//     email: 'nathan.edwards@email.com',
//     password: 'Test901&',
//     role: 'admin',
//   },
//   {
//     name: 'Olivia Collins',
//     email: 'olivia.collins@email.com',
//     password: 'Pass234*',
//     role: 'viewer',
//   },
//   {
//     name: 'Paul Stewart',
//     email: 'paul.stewart@email.com',
//     password: 'Secret567!',
//     role: 'viewer',
//   },
//   {
//     name: 'Quinn Sanchez',
//     email: 'quinn.sanchez@email.com',
//     password: 'MyPass890@',
//     role: 'admin',
//   },
//   {
//     name: 'Ruby Morris',
//     email: 'ruby.morris@email.com',
//     password: 'Secure123#',
//     role: 'viewer',
//   },
//   {
//     name: 'Steven Rogers',
//     email: 'steven.rogers@email.com',
//     password: 'Test456$',
//     role: 'viewer',
//   },
//   {
//     name: 'Teresa Reed',
//     email: 'teresa.reed@email.com',
//     password: 'Pass789%',
//     role: 'admin',
//   },
//   {
//     name: 'Uma Cook',
//     email: 'uma.cook@email.com',
//     password: 'Secret012&',
//     role: 'viewer',
//   },
//   {
//     name: 'Victor Morgan',
//     email: 'victor.morgan@email.com',
//     password: 'MyPass345*',
//     role: 'viewer',
//   },
//   {
//     name: 'Wendy Bell',
//     email: 'wendy.bell@email.com',
//     password: 'Secure678!',
//     role: 'admin',
//   },
//   {
//     name: 'Xavier Murphy',
//     email: 'xavier.murphy@email.com',
//     password: 'Test901@',
//     role: 'viewer',
//   },
// ]

// Contestants dataset (~50 items)
export const contestants = [
  {
    name: 'Aurora Borealis',
    song: 'Northern Lights',
    nationality: 'Norway',
    lyrics:
      'Dancing colors in the sky, waves of green and purple high. Arctic winds whisper tales untold, of ancient magic, brave and bold.',
  },
  {
    name: 'Luna Celestia',
    song: 'Moonlit Dreams',
    nationality: 'Italy',
    lyrics:
      'Under the moon we dance tonight, silver beams our guiding light. Dreams unfold like petals bloom, in this enchanted midnight room.',
  },
  {
    name: 'Phoenix Rising',
    song: 'From the Ashes',
    nationality: 'Greece',
    lyrics:
      'Rise up from the flames below, stronger than we used to know. Wings of fire, heart of gold, a new story to be told.',
  },
  {
    name: 'Echo Valley',
    song: 'Whispers Return',
    nationality: 'Ireland',
    lyrics:
      'In the valley where echoes play, every word finds its way. Mountains tall remember all, the secrets whispered, great and small.',
  },
  {
    name: 'Stella Marina',
    song: 'Ocean Stars',
    nationality: 'Portugal',
    lyrics:
      'Stars reflected in the sea, endless possibilities. Waves that crash upon the shore, bring us tales of evermore.',
  },
  {
    name: 'Thunder Storm',
    song: 'Electric Hearts',
    nationality: 'Germany',
    lyrics:
      'Lightning strikes and thunder roars, breaking down all closed doors. Electric hearts beat as one, until the storm is done.',
  },
  {
    name: 'Crystal Dawn',
    song: 'Breaking Light',
    nationality: 'Sweden',
    lyrics:
      'Crystal clear the morning breaks, every soul within it wakes. Dawn arrives with golden hue, painting skies in colors new.',
  },
  {
    name: 'Mystic River',
    song: 'Flow of Time',
    nationality: 'France',
    lyrics:
      'Rivers flow through space and time, ancient rhythms, perfect rhyme. Mystic waters, deep and true, carrying dreams of me and you.',
  },
  {
    name: 'Solar Flare',
    song: 'Burning Bright',
    nationality: 'Spain',
    lyrics:
      'Burning bright like solar flares, passion fills the atmosphere. Dance with fire, feel the heat, move your body to the beat.',
  },
  {
    name: 'Velvet Night',
    song: 'Midnight Velvet',
    nationality: 'Belgium',
    lyrics:
      'Velvet darkness wraps around, silence makes the sweetest sound. In the night we come alive, feeling free, we thrive.',
  },
  {
    name: 'Arctic Wind',
    song: 'Frozen Hearts',
    nationality: 'Finland',
    lyrics:
      'Arctic winds blow cold and free, across the frozen northern sea. Hearts of ice begin to melt, emotions never before felt.',
  },
  {
    name: 'Desert Rose',
    song: 'Oasis Dreams',
    nationality: 'Morocco',
    lyrics:
      'In the desert blooms a rose, where the hidden water flows. Dreams oasis in the sand, reach out and take my hand.',
  },
  {
    name: 'Neon Lights',
    song: 'City Pulse',
    nationality: 'Japan',
    lyrics:
      'Neon lights paint the night, urban jungle burning bright. City pulse beats in our veins, breaking all the chains.',
  },
  {
    name: 'Mountain Echo',
    song: 'Heights of Glory',
    nationality: 'Switzerland',
    lyrics:
      'From the mountain peaks so high, echoes reaching for the sky. Glory found in every climb, transcending space and time.',
  },
  {
    name: 'Ocean Wave',
    song: 'Tidal Love',
    nationality: 'Australia',
    lyrics:
      'Ocean waves crash on the beach, love is always within reach. Tidal forces pull us near, washing away every fear.',
  },
  {
    name: 'Forest Spirit',
    song: 'Ancient Trees',
    nationality: 'Canada',
    lyrics:
      'Ancient trees with stories old, mysteries yet to be told. Forest spirits dance and sing, of the magic that they bring.',
  },
  {
    name: 'Golden Sand',
    song: 'Desert Wind',
    nationality: 'Egypt',
    lyrics:
      'Golden sand beneath our feet, desert wind so bittersweet. Pyramids watch from afar, guided by the evening star.',
  },
  {
    name: 'Cosmic Dream',
    song: 'Stardust',
    nationality: 'Russia',
    lyrics:
      'We are made of stardust bright, traveling at the speed of light. Cosmic dreams within our soul, making broken spirits whole.',
  },
  {
    name: 'Emerald Isle',
    song: 'Celtic Heart',
    nationality: 'Scotland',
    lyrics:
      'Emerald hills roll on forever, Celtic hearts surrender never. Bagpipes play our ancient song, to this land we all belong.',
  },
  {
    name: 'Sapphire Sky',
    song: 'Blue Horizon',
    nationality: 'Netherlands',
    lyrics:
      'Sapphire sky meets the sea, endless blue infinity. Horizons call us to explore, always seeking something more.',
  },
  {
    name: 'Ruby Fire',
    song: 'Passion Flame',
    nationality: 'Brazil',
    lyrics:
      'Ruby fire in our hearts, passion where the music starts. Rhythm flowing through our veins, breaking all the chains.',
  },
  {
    name: 'Diamond Light',
    song: 'Shining Through',
    nationality: 'South Africa',
    lyrics:
      'Diamond light cuts through the dark, igniting every single spark. Shining through the deepest night, everything will be alright.',
  },
  {
    name: 'Amber Glow',
    song: 'Sunset Dreams',
    nationality: 'Mexico',
    lyrics:
      'Amber glow of setting sun, day is over, night begun. Dreams awakened by the dusk, in the twilight we trust.',
  },
  {
    name: 'Pearl Moon',
    song: 'Lunar Dance',
    nationality: 'China',
    lyrics:
      'Pearl moon hanging in the sky, watching as the world goes by. Lunar dance of shadow play, night turns into day.',
  },
  {
    name: 'Silver Stream',
    song: 'Flowing Free',
    nationality: 'Argentina',
    lyrics:
      'Silver streams flow to the sea, wild and flowing free. Water finds its own true course, nature is the greatest force.',
  },
  {
    name: 'Copper Sun',
    song: 'Dawn Rising',
    nationality: 'India',
    lyrics:
      'Copper sun begins to rise, painting colors in the skies. Dawn is breaking, new day born, welcome to the morn.',
  },
  {
    name: 'Bronze Age',
    song: 'Time Machine',
    nationality: 'Turkey',
    lyrics:
      'Bronze age echoes from the past, moments that were meant to last. Time machine within our minds, leaving nothing behind.',
  },
  {
    name: 'Iron Will',
    song: 'Unbreakable',
    nationality: 'Poland',
    lyrics:
      'Iron will and heart of steel, showing them just how we feel. Unbreakable we stand as one, until the battle is won.',
  },
  {
    name: 'Steel Dream',
    song: 'Metal Heart',
    nationality: 'Austria',
    lyrics:
      'Steel dreams forged in fire bright, metal heart beats through the night. Strong and true we face the storm, in the chaos we transform.',
  },
  {
    name: 'Platinum Star',
    song: 'Shine Forever',
    nationality: 'Denmark',
    lyrics:
      'Platinum star up in the sky, shine forever, never die. Light the way for those below, let your brilliance show.',
  },
  {
    name: 'Crystal Lake',
    song: 'Mirror Soul',
    nationality: 'Estonia',
    lyrics:
      'Crystal lake reflects the soul, making broken spirits whole. Mirror of the truth within, where the healing begins.',
  },
  {
    name: 'Marble Stone',
    song: 'Carved in Time',
    nationality: 'Croatia',
    lyrics:
      'Marble stone carved by hand, stories from a distant land. Time may weather, time may fade, but the memories we made.',
  },
  {
    name: 'Granite Peak',
    song: 'Standing Tall',
    nationality: 'Slovenia',
    lyrics:
      'Granite peak stands tall and proud, head above the passing cloud. Standing tall through every storm, keeping spirits warm.',
  },
  {
    name: 'Obsidian Night',
    song: 'Dark Crystal',
    nationality: 'Iceland',
    lyrics:
      'Obsidian night, dark as coal, crystals forming in the soul. From the darkness comes the light, everything will be alright.',
  },
  {
    name: 'Quartz Light',
    song: 'Crystal Clear',
    nationality: 'Czech Republic',
    lyrics:
      'Quartz light shining crystal clear, washing away every fear. Truth revealed in pristine shine, your heart beats with mine.',
  },
  {
    name: 'Jade Garden',
    song: 'Eastern Wind',
    nationality: 'South Korea',
    lyrics:
      'Jade garden where the bamboo grows, eastern wind that gently blows. Peace and beauty all around, in this sacred ground.',
  },
  {
    name: 'Opal Dream',
    song: 'Rainbow Heart',
    nationality: 'New Zealand',
    lyrics:
      'Opal dreams in colors bright, rainbow heart takes flight. Every hue tells its own tale, on this cosmic trail.',
  },
  {
    name: 'Turquoise Sea',
    song: 'Island Life',
    nationality: 'Jamaica',
    lyrics:
      'Turquoise sea and golden sand, paradise at hand. Island life moves with the tide, let the rhythm be your guide.',
  },
  {
    name: 'Coral Reef',
    song: 'Ocean Garden',
    nationality: 'Philippines',
    lyrics:
      'Coral reef beneath the waves, ocean garden nature saves. Colors dancing in the blue, life renewed.',
  },
  {
    name: 'Lava Flow',
    song: 'Volcanic Heart',
    nationality: 'Hawaii',
    lyrics:
      'Lava flows from deep within, where the fire begins. Volcanic heart burns bright and true, creating something new.',
  },
  {
    name: 'Ash Cloud',
    song: 'Phoenix Song',
    nationality: 'Chile',
    lyrics:
      'From the ash cloud we emerge, at the mountain verge. Phoenix song rings loud and clear, conquering every fear.',
  },
  {
    name: 'Snow Crystal',
    song: 'Winter Magic',
    nationality: 'Latvia',
    lyrics:
      'Snow crystals falling from above, each one made with love. Winter magic in the air, beauty everywhere.',
  },
  {
    name: 'Ice Queen',
    song: 'Frozen Crown',
    nationality: 'Lithuania',
    lyrics:
      'Ice queen wears a frozen crown, never let them bring you down. Cold as winter, strong as steel, show them how you feel.',
  },
  {
    name: 'Rain Dance',
    song: 'Storm Blessing',
    nationality: 'Kenya',
    lyrics:
      'Rain dance brings the storm, blessing in its form. Thunder drums and lightning bright, dancing through the night.',
  },
  {
    name: 'Wind Walker',
    song: 'Sky Path',
    nationality: 'Mongolia',
    lyrics:
      'Wind walker on the sky path high, where the eagles fly. Ancient wisdom in the breeze, flowing through the trees.',
  },
  {
    name: 'Earth Mother',
    song: 'Sacred Ground',
    nationality: 'Peru',
    lyrics:
      'Earth mother holds us in her hand, sacred is this land. From her soil all life does grow, more than we could know.',
  },
  {
    name: 'Fire Bird',
    song: 'Flame Wings',
    nationality: 'Ukraine',
    lyrics:
      'Fire bird with wings of flame, wild and never tame. Rising up to touch the sun, new life has begun.',
  },
  {
    name: 'Water Lily',
    song: 'Pond Reflection',
    nationality: 'Thailand',
    lyrics:
      'Water lily on the pond, of this world and beyond. Reflection of the sky above, floating there with love.',
  },
  {
    name: 'Sky Dancer',
    song: 'Cloud Nine',
    nationality: 'Israel',
    lyrics:
      'Sky dancer on cloud nine, where the stars align. Dancing high above it all, ready for the fall.',
  },
  {
    name: 'Star Gazer',
    song: 'Cosmic Love',
    nationality: 'Romania',
    lyrics:
      'Star gazer looking up above, searching for cosmic love. In the vastness of the night, everything feels right.',
  },
]

// Votes dataset (~50 items)
export const votes = [
  { email: 'voter1@example.com', choice: 1 },
  { email: 'voter2@example.com', choice: 1 },
  { email: 'voter3@example.com', choice: 1 },
  { email: 'voter4@example.com', choice: 1 },
  { email: 'voter5@example.com', choice: 1 },
  { email: 'voter6@example.com', choice: 1 },
  { email: 'voter7@example.com', choice: 1 },
  { email: 'voter8@example.com', choice: 1 },
  { email: 'voter9@example.com', choice: 1 },
  { email: 'voter10@example.com', choice: 1 },
  { email: 'enthusiast11@mail.com', choice: 1 },
  { email: 'fan12@email.com', choice: 1 },
  { email: 'supporter13@mail.com', choice: 1 },
  { email: 'music14@example.com', choice: 1 },
  { email: 'lover15@mail.com', choice: 1 },
  { email: 'audience16@email.com', choice: 1 },
  { email: 'spectator17@mail.com', choice: 1 },
  { email: 'viewer18@example.com', choice: 1 },
  { email: 'listener19@mail.com', choice: 1 },
  { email: 'participant20@email.com', choice: 1 },
  { email: 'contest21@mail.com', choice: 1 },
  { email: 'judge22@example.com', choice: 1 },
  { email: 'critic23@mail.com', choice: 1 },
  { email: 'reviewer24@email.com', choice: 1 },
  { email: 'observer25@mail.com', choice: 1 },
  { email: 'watcher26@example.com', choice: 1 },
  { email: 'follower27@mail.com', choice: 1 },
  { email: 'admirer28@email.com', choice: 1 },
  { email: 'devotee29@mail.com', choice: 1 },
  { email: 'aficionado30@example.com', choice: 1 },
  { email: 'buff31@mail.com', choice: 1 },
  { email: 'expert32@email.com', choice: 1 },
  { email: 'pro33@mail.com', choice: 1 },
  { email: 'specialist34@example.com', choice: 1 },
  { email: 'connoisseur35@mail.com', choice: 1 },
  { email: 'maven36@email.com', choice: 1 },
  { email: 'guru37@mail.com', choice: 1 },
  { email: 'master38@example.com', choice: 1 },
  { email: 'wizard39@mail.com', choice: 1 },
  { email: 'ace40@email.com', choice: 1 },
  { email: 'champion41@mail.com', choice: 1 },
  { email: 'winner42@example.com', choice: 1 },
  { email: 'victor43@mail.com', choice: 1 },
  { email: 'hero44@email.com', choice: 1 },
  { email: 'star45@mail.com', choice: 1 },
  { email: 'celebrity46@example.com', choice: 1 },
  { email: 'icon47@mail.com', choice: 1 },
  { email: 'legend48@email.com', choice: 1 },
  { email: 'myth49@mail.com', choice: 1 },
  { email: 'finale50@example.com', choice: 1 },
]
