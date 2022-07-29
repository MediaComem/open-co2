#!/usr/bin/env python3

"""
An example to get all the Open CO2 categories
Using requests module
"""
import requests
import pprintjson

# Adapt to your GraphQL endpoint
ENDPOINT = 'http://localhost:4000/graphql'

# Query function
def query(graphqlQuery):
    try:
      request = requests.post(ENDPOINT, json={'query': graphqlQuery})
      return request.json() # Result as JSON
    except requests.exceptions.RequestException as error:
      print("Request error: ", error)
      quit()

# Define GraphQL query
allCategories = """
{
  categories {
    name
    co2eq {
      value
      unit
    }
  }
}
"""

# Execute query
result = query(allCategories)

# Print result as JSON
pprintjson.pprintjson(result)
