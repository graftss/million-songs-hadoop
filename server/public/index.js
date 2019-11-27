const makeOptions = body => ({
  method: 'POST',
  body: JSON.stringify(body),
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

const assocField = (result, field) => {
  const value = document.getElementById(field).value;
  if (value !== '') result[field] = value;
  return result;
};

const searchFields = ['title', 'artist_name', 'release', 'year_min', 'year_max', 'duration_min', 'duration_max', 'key', 'mode'];
const getSearch = () => searchFields.reduce(assocField, {});

const paramFields = ['reducers', 'max_results', 'results_page'];
const getParams = () => paramFields.reduce(assocField, {});

const getSearchOptions = () => makeOptions({
  search: getSearch(),
  params: getParams(),
});

const separator = '*,*';
const parseSearchResponse = res => res.split('\t')[0].split(separator);

const requestSearch = () => fetch('/api/search', getSearchOptions())
  .then(res => res.json())
  .then(body => {
    body.results = body.results.split('\n').map(parseSearchResponse)
    return body;
  });

const responseFields = ['Song', 'Album', 'Artist', 'Year', 'Duration', 'Key'];
const renderHeaderRow = () => `
  <tr>${responseFields.map(field => `<th>${field}</th>`).join('')}</tr>
`;

const renderRecordRow = record => `
  <tr>${record.map(value => `<td class="result">${value}</td>`).join('')}</tr>
`;

const renderTable = records => `
  <table>
    <thead>${renderHeaderRow()}</thead>
    <tbody>${records.map(renderRecordRow).join('')}</tbody>
  </table>
`;

const renderSummary = summary => `
  <span>
    Displaying <em>${summary.displayed}</em>
    of <em>${summary.maxResults}</em> results
    (<em>${summary.minIndex + 1}</em> to
    <em>${Math.min(summary.maxIndex + 1, summary.maxResults)}</em>).
    Search completed in <em>${summary.duration}</em> seconds.
    ${summary.cached ? '(cached)' : ''}
  </span>
`;

const mockRequestSearch = () => Promise.resolve(mockResponse);

const searchButton = document.getElementById('submit');
const disableSearch = () => {
  searchButton.disabled = true;
};
const enableSearch = () => {
  searchButton.disabled = false;
};


function onClick() {
  const startTime = new Date().getTime();
  disableSearch();
  // mockRequestSearch()
  requestSearch()
    .then(({ results, searchSummary }) => {
      enableSearch();
      document.getElementById('results').innerHTML = renderTable(results);

      const summary = {
        duration: ((new Date().getTime()) - startTime) / 1000,
        displayed: results.length,
        maxResults: searchSummary.maxResults,
        minIndex: searchSummary.minIndex,
        maxIndex: searchSummary.maxIndex,
        cached: searchSummary.cached,
      };

      document.getElementById('summary').innerHTML = renderSummary(summary);
    });
}

const mockResponse = JSON.parse(`[["Barco Quieto","Canciones Para Grandes","María Elena Walsh","2005","3:10","C major"],["Battle Field featuring Block & Big Gee (Explicit Album Version)","Welcome To The Zoo","Gorilla Zoe featuring Block & Big Gee","2007","3:55","B minor"],["Beautiful Regret","Piece Of My Soul","Garou","2008","3:29","C# major"],["Berry Metal","Desert Doughnuts","Metallic Falcons","2005","5:09","C major"],["Bo Carter Special","Bo Carter Vol. 2 (1931 - 1934)","Bo Carter","1994","2:53","F# major"],["Brautigan (Giorni Che Finiscono) (Acoustic Session '07)","Pianissimo Fortissimo","Perturbazione","2007","4:14","B minor"],["Caked","Versatile Arab Chord Chart","Vibracathedral Orchestra","2000","3:58","C# major"],["Cannot Forgive","Dubioza kolektiv","Dubioza kolektiv","2004","4:34","C# minor"],["De Fanfare Van Honger En Dorst","Eigen Kweek (1967-2000)","Jan De Wilde","1994","5:23","D major"],["Dial 481","Love Technology","Heads We Dance","2009","0:59","Eb minor"],["Either Way I Think You Know","Either Way I Think You Know","Minor Majority","2010","4:38","B major"],["El Shaddai","All Keyed Up","Ben Tankard","1994","4:00","C major"],["Enforcer (Nimm das! Remix by NamNamBulu)","Enforcer EP","Syrian","2005","7:41","G major"],["Everything You Say Sounds Like Gospel","Still Waiting For Spring","Matt Nathanson","2000","3:06","G major"],["Face To Face (Cosmo VItelli Remix)","Daft Club","Daft Punk","2003","4:53","F# minor"],["Federazione Porno","Alone Alieno","Tiromancino","1995","3:40","F minor"],["Halcyon: The Heavy Silence: In Silent Rain","Cypher","& And Oceans","2002","3:44","D major"],["How Important Can It Be","Teen Dreams 1955","Joni James","1997","2:31","C# major"],["Infiltrating My Way Through The System (Mix)","My Revenge On The World","Ayria","2005","6:23","B minor"],["King Of Drama","The Time Is Now","Endstand","2006","2:42","D major"],["Krigare","Grogrund","Kultiration","2005","5:30","F minor"],["LL12 Cart Etak (08/01/01)","Showcase","Lackluster","2003","4:21","C major"],["La Valse D'Amélie (Version Orchestre)","Amelie From Montmartre","Yann Tiersen","2001","2:00","F major"],["Lady Soul (Aretha In The A.M.)","Strange Language","Charlie Peacock","1996","3:56","E major"],["Last Steam Engine Train","Way Live","The Waybacks","2003","4:15","E major"],["Left (feat. Fabian Reichelt)","Left / Right EP","Marek Hemmann","2010","7:58","G major"],["Ma Petite Maison Dans La Cité","Hip Hop Therapy","Lady Laistee","2002","3:31","A major"],["Malagueño - Azul (De Malaga Malagueñito)","Picasso En Mis Ojos","Diego El Cigala","2005","3:21","A major"],["Mi Corazon","Livin' In The City","Fun Lovin' Criminals","2005","3:25","C# major"],["More Than Ever People","More Than Ever People (The Remixes)","Levitation","1998","5:41","C minor"],["My Heart Is Beating Fast","See You In The Morning","Mint Royale","2005","4:14","Bb minor"],["Oot kaunis","Pahat Ja Rumat","Ne Luumaet","1991","3:02","G minor"],["Pulsar","Red Noise","Yennah","2001","7:40","F# major"],["Redneck Yacht Club","My Kind Of Livin'","Craig Morgan","2005","3:47","Ab major"],["Sad As The World","Kiske","Michael Kiske","2006","3:23","Bb major"],["Searching For My Baby","Raw Electric 1979-1980","R.L. Burnside & The Sound Machine","2001","3:38","Bb minor"],["She's Strange (live)","Nasty","Cameo","1996","2:37","C# major"],["Song For Mahila","I Am  Not Afraid Of  You And I Will Beat Your Ass","Yo La Tengo","2006","3:40","C major"],["Spiritual Healing","Spiritual Healing","The Muses Rapt","1997","9:29","D major"],["Splendid Isolation","Cuban Ballerina","Dead To Me","2006","2:21","G major"],["Stereo Gangsta","Rebel Songs","Goldblade","2005","3:59","D major"],["Stubborn (Psalms 151)","There's More Where That Came From","Lee Ann Womack","2005","6:52","Ab major"],["Survival","Melody Life","Marcia Griffiths","2007","3:08","A major"],["The Day Before You","Feels Like Today","Rascal Flatts","2004","4:05","D major"],["The Eye of the Hurricane","The Swamp Angel","Bain Wolfkind","2008","3:34","E major"],["Where The Party At","So So Def presents: Definition of a Remix feat. Jermaine Dupri and Jagged Edge (This Is The Remix) (Explicit Version)","Jagged Edge featuring Jermaine Dupri_ Da Brat_ R.O.C._ Lil Bow Wow and Tigah","2001","3:52","F minor"],[""]]`);
