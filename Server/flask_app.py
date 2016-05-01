from datetime import timedelta
from flask import Flask, make_response, request, current_app
from functools import update_wrapper
import commands

app = Flask(__name__)

def crossdomain(origin=None, methods=None, headers=None,
                max_age=21600, attach_to_all=True,
                automatic_options=True):
    if methods is not None:
        methods = ', '.join(sorted(x.upper() for x in methods))
    if headers is not None and not isinstance(headers, basestring):
        headers = ', '.join(x.upper() for x in headers)
    if not isinstance(origin, basestring):
        origin = ', '.join(origin)
    if isinstance(max_age, timedelta):
        max_age = max_age.total_seconds()

    def get_methods():
        if methods is not None:
            return methods

        options_resp = current_app.make_default_options_response()
        return options_resp.headers['allow']

    def decorator(f):
        def wrapped_function(*args, **kwargs):
            if automatic_options and request.method == 'OPTIONS':
                resp = current_app.make_default_options_response()
            else:
                resp = make_response(f(*args, **kwargs))
            if not attach_to_all and request.method != 'OPTIONS':
                return resp

            h = resp.headers

            h['Access-Control-Allow-Origin'] = origin
            h['Access-Control-Allow-Methods'] = get_methods()
            h['Access-Control-Max-Age'] = str(max_age)
            if headers is not None:
                h['Access-Control-Allow-Headers'] = headers
            return resp

        f.provide_automatic_options = False
        return update_wrapper(wrapped_function, f)
    return decorator



def formatResponse(string):
    return string[string.find("{"):len(string)]





def getRiotAPIKey():
    return "04f3bf38-d501-4a30-805c-a6387e6ffe58"

def sendRequestToRiot(url):
    command = "curl --request get '"+url+"'"
    status,output = commands.getstatusoutput(command)
    return formatResponse(output)





def getChampionsSkinsInfo():
    getChampionsInfoURL= "https://global.api.pvp.net/api/lol/static-data/na/v1.2/champion?champData=skins&api_key="+getRiotAPIKey()
    return sendRequestToRiot(getChampionsInfoURL)

def getSummonerInfo(summonerName,summonerRegion):
    getSummonerInfoURL = "https://"+summonerRegion+".api.pvp.net/api/lol/"+summonerRegion+"/v1.4/summoner/by-name/"+summonerName+"?api_key="+getRiotAPIKey()
    return sendRequestToRiot(getSummonerInfoURL)

def getSummonerLeague(summonerID, summonerRegion):
    getSummonerLeagueURL = "https://"+summonerRegion.lower()+".api.pvp.net/api/lol/"+summonerRegion.lower()+"/v2.5/league/by-summoner/"+summonerID+"/entry?api_key="+getRiotAPIKey()
    return sendRequestToRiot(getSummonerLeagueURL)


def getSummonerMastery(summonerID,summonerRegion):
    maxChampions = 130
    platforms = {}
    platforms['br'] = 'br1'
    platforms['eune'] = 'eune1'
    platforms['euw'] = 'euw1'
    platforms['jp'] = 'jp1'
    platforms['kr'] = 'kr'
    platforms['lan'] = 'la1'
    platforms['las'] = 'la2'
    platforms['na'] = 'na1'
    platforms['oce'] = 'oce1'
    platforms['ru'] = 'ru'
    platforms['tr'] = 'tr1'

    getSummonerMasteryURL = "https://"+summonerRegion.lower()+".api.pvp.net/championmastery/location/"+platforms[summonerRegion.lower()]+"/player/"+summonerID+"/topchampions?count="+str(maxChampions)+"&api_key="+getRiotAPIKey()
    return sendRequestToRiot(getSummonerMasteryURL)

def getSummonerMatches(summonerID,summonerRegion):
    rankedQueues="TEAM_BUILDER_DRAFT_RANKED_5x5,RANKED_SOLO_5x5,RANKED_TEAM_5x5"
    seasons="SEASON2015,PRESEASON2016,SEASON2016"
    getSummonerMatchesURL = "https://"+summonerRegion.lower()+".api.pvp.net/api/lol/"+summonerRegion.lower()+"/v2.2/matchlist/by-summoner/"+summonerID+"?rankedQueues="+rankedQueues+"&seasons="+seasons+"&api_key="+getRiotAPIKey()
    return sendRequestToRiot(getSummonerMatchesURL)

def getChampionsTagsInfo(summonerRegion):
    getChampionsTagsInfo = "https://global.api.pvp.net/api/lol/static-data/"+summonerRegion.lower()+"/v1.2/champion?champData=tags&api_key="+getRiotAPIKey()
    return sendRequestToRiot(getChampionsTagsInfo)



@app.route("/",methods=['GET', 'POST'])
@crossdomain(origin='*')
def index():
    if( request.args.get('getChampionsSkinsInfo')  == 'true' ):
        return getChampionsSkinsInfo()
    elif( request.args.get('getSummonerInfo') == 'true'):
        return getSummonerInfo(request.args.get('summonerName'),request.args.get('summonerRegion'))
    elif( request.args.get('getSummonerLeague') == 'true'):
        return getSummonerLeague(request.args.get('summonerID'),request.args.get('summonerRegion'))
    elif( request.args.get('getSummonerMastery') == 'true'):
        return getSummonerMastery(request.args.get('summonerID'),request.args.get('summonerRegion'))
    elif( request.args.get('getSummonerMatches') == 'true'):
        return getSummonerMatches(request.args.get('summonerID'),request.args.get('summonerRegion'))
    elif( request.args.get('getChampionsTagsInfo') == 'true'):
        return getChampionsTagsInfo(request.args.get('summonerRegion'))

    return "{'invalidParameters':'true'}"

if __name__ == "__main__":
    app.run()