from SPARQLWrapper import SPARQLWrapper, JSON
import sys
import requests


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
    wdQuery = f"""SELECT DISTINCT ?patrimonio ?type ?nombre_patrimonio ?distance ?location
    WHERE 
    {{
        BIND('Point({lat} {long})'^^geo:wktLiteral AS ?myLocation)
        ?patrimonio wdt:P31/wdt:P279* wd:Q2434238; 
                    wdt:P625 ?location;
                    rdfs:label ?nombre_patrimonio;
                    wdt:P31 ?type. 
        BIND(geof:distance(?myLocation, ?location) AS ?distance)
        FILTER(?distance < {distance_threshold} && lang(?nombre_patrimonio) = "{lang}")
    }}
    ORDER BY ASC (?distance)
    """
    endpoint = "http://query.wikidata.org/sparql"
    response = run_sparql_query(endpoint, wdQuery)
    return wikidata_to_json(response)


def wikidata_to_json(results):
    return_json = []
    knownTypes = { "Q2065736" : "cultural property", "Q4989906" : "monument", "Q811979" : "architectural structure", "Q35112127" : "historic building" }
    for r in results:
        result = {}
        for key in r:
            if key == "distance":
                result[key] = round(float(r[key]["value"]), 2)
            elif key == "location":
                coords = r[key]["value"][6:-1].split(" ")
                result["lat"] = coords[0]
                result["long"] = coords[1]
            elif key == "type":
                entityQ = r[key]["value"][31:]
                result[key] = knownTypes[entityQ] if entityQ in knownTypes else "other"
            else:
                result[key] = r[key]["value"]
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
