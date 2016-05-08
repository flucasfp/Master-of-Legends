# Master-of-Legends

Master of Legends is my entry to <a href="https://developer.riotgames.com/discussion/announcements/show/eoq3tZd1">The Riot Games API Challenge 2016</a>.

The Application is useful to Visualize and Analyze Mastery Champion Data from the Riot Games API.

How to make it run:
- You can see the Application live here, in the GitHub Pages: <a href="http://flucasfp.github.io/Master-of-Legends/">Master of Legends</a>.
- The Server Side for the live version is freely hosted in PythonAnywhere.

But if you really want to run it locally, you will need:
- Python 2.7
- Flask 0.9 (Python Server library)
- Requests (Python library)

Then you will have to make some small changes:
- Go to Server/ and change the line 53 of file flask_app.py to return your Developer Key String in method 'getRiotAPIKey'
- Go to file js/ServerCommunication.js and change the 'var serverURL' to the Server Path you want. In this example we'll use "http://localhost:5000/?"

Done! Now you can run the server by following the steps:
- Go to Server/ by command line and type "python flask_app.py", it should open the server in localhost:5000.
- Open another Terminal, go to the Main Project Folder and type "python -m SimpleHTTPServer", it should start the Server in localhost:8000.

Done! You can see it working by typing localhost:8000 in your Browser.

Now let me talk about the structure of the Application.

The Application has two main parts: Server Side and Client Side.

The Server Side has only one responsability: Manage the communication between the Client Side and the Riot API Server. The flow of the requests is:<br>
Client Side --request-->Server Side--request-->Riot API Server--response-->Server Side--response-->Cliente Side

About the Client Side.
<br>I created the following modules:
- LocationSearcher.js: auxiliar module to work with URL reading. It's useful because I'm using the URL to pass parameters from the Home Page to the Summoner Page
- ServerCommunication.js: responsible for sending GET Requests to the Server Side and returning its response. JQuery is used to make all asynchronous requests.
- MainControler.js: responsible for telling the Application which Page is running and should load.
- DynamicStyle.js: responsible for general dynamically created styles, like the Random Background Image and the Random Button Text.
- Summoner.js: responsible for storing Summoner's Data and have the majority of the methods that make the Summoner Page run.
- Champion.js: responsible for storing Champion's Data and auxiliar methods about Champions, like getting champion name by champion ID.
- Matches.js: responsible for grouping a given list of Matches in an Object. This grouping is better explained in the About Page.
- ChartCreator: responsible for create the Bar and Pie Charts of the Summoner Page. It make the correct calls to the HighCharts and D3 librarys
- Comparator.js: responsible for all the dynamic behavior of the Comparator Feature. It also makes the Chart.
- TeamBuilder.js: responsible for all the operations made in the Team Builder Page.

Have anything to talk to me? Contact is available in the About Page.



