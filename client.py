from SPARQLWrapper import SPARQLWrapper, JSON
import sys
import requests
from geopy import distance

def run_sparql_query(endpoint, query, nattempts=3):
    sparql = SPARQLWrapper(endpoint)
    sparql.setReturnFormat(JSON)

    sparql.setQuery(query)
    attempts = 0
    while attempts < nattempts:
        try:
            return sparql.query().convert()["results"]["bindings"]
        except Exception:
            attempts += 1
            if attempts == nattempts:
                return sys.exc_info()[1]


def get_historical_events(lat, long, distance_threshold=10, lang="es"):
    wdQuery = f"""SELECT DISTINCT ?patrimonio ?nombre_patrimonio ?distance ?location
    WHERE 
    {{
        ?patrimonio wdt:P31/wdt:P279* wd:Q2434238; 
                    wdt:P17 wd:Q298;
                    wdt:P625 ?location;
                    rdfs:label ?nombre_patrimonio;
        FILTER(lang(?nombre_patrimonio) = "es")
    }}
    """
    endpoint = "http://query.wikidata.org/sparql"
    response = run_sparql_query(endpoint, wdQuery)
    return wikidata_to_json(response, distance_threshold, lat, long)


def wikidata_to_json(results, distance_threshold, lat, long):
    return_json = []
    knownTypes = { "Q2065736" : "cultural property", "Q4989906" : "monument", "Q811979" : "architectural structure", "Q35112127" : "historic building" }
    for r in results:
        result = {}
        too_far = False
        for key in r:
            if key == "distance":
                current_distance = round(float(r[key]["value"]), 2)
                if current_distance > 10 :
                    continue
                result[key] = current_distance
            elif key == "location":
                leftIndex = r[key]["value"].find('(')
                rightIndex = r[key]["value"].find(')')
                if leftIndex < 0 or rightIndex < 0 :
                    continue
                coords = r[key]["value"][leftIndex+1:rightIndex].split(" ")
                point_1 = (lat, long)
                point_2 = (coords[1], coords[0])
                if distance.distance(point_1, point_2).km > distance_threshold :
                    too_far = True
                result["lat"] = coords[0]
                result["long"] = coords[1]

            else:
                result[key] = r[key]["value"]
        if too_far :
            continue
        return_json.append(result)
    return return_json


def get_response_descriptions(wd_json, lang="es"):
    endpoint = "https://{lang}.wikipedia.org/w/api.php?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles={name}"
    names = "|".join([r.get("nombre_patrimonio") for r in wd_json])
    response = requests.get(endpoint.format(lang=lang, name=names))
    descriptions = map_wikipedia_response_to_json(response)
    for r in wd_json:
        r["description"] = descriptions.get(r["nombre_patrimonio"], "")
    return wd_json


def map_wikipedia_response_to_json(response):
    pages = response.json().get("query", {}).get("pages", {})
    descriptions = {}
    for key in pages:
        description = pages[key].get("extract")
        if description:
            descriptions[pages[key]["title"]] = description
    return descriptions
