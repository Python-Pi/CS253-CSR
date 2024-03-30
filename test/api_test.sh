#!/bin/bash

# Things to be modified for running the script:
# 1. Set the base URL of your get_api
# 2. Set the required cookie of your get_api
# 3. Change the trip_name and destination in the get_apis array to match your get_api

# Set the base URL, required cookie of your get_api
base_url="http://172.23.15.187:8000"    
cookie="s%3AwWbOMwIugC9bdDSxwzZZqpfyHlCaUqwW.sL6iVOz46jpv%2BZ7DYPUSo4VTfif1znaUMzWb4yI0e1U"

# Check if terminal supports colors
if [[ -t 1 ]]; then
  RED='\033[0;31m'
  GREEN='\033[0;32m'
  YELLOW='\033[0;33m'
  NC='\033[0m' # No Color
else
  RED=''
  GREEN=''
  YELLOW=''
  NC=''
fi

pass=0
fail=0
total=0

get_apis=(
  "/"
  "/api/login"
  "/api/user/name"
  "/api/travel/trips"
  "/api/travel/joinedTrips"
  "/api/travel/hostedTrips"
  "/api/travel/specificTrip?trip_name=Vision%20Hunt%20Decree&destination=Narukami%20Island"
  "/api/travel/userStatus?trip_name=Vision%20Hunt%20Decree&destination=Narukami%20Island"
)
get_expected_responses=(
  '{"status":true}'
  '{"status":true,"loggedIn":true,"name":'
  '{"status":true,"loggedIn":true,"name":'
  '{"status":true,"loggedIn":true,"trips":'
  '{"status":true,"loggedIn":true,"trips":'
  '{"status":true,"loggedIn":true,"trips":'
  '{"status":true,"loggedIn":true,"trips":'
  '{"status":true,"loggedIn":true,"userStatus":'
)
  
# Loop through the GET get_apis and expected responses
for ((i=0; i<${#get_apis[@]}; i++)); do
  echo ""
  get_api="${get_apis[$i]}"
  get_expected_response="${get_expected_responses[$i]}"

  # Send a request to the current get_api endpoint and print the response
  echo -e "${YELLOW}Checking ${get_api} endpoint...${NC}"
  response=$(curl -s -b "connect.sid=${cookie}" -X GET "${base_url}${get_api}")
  echo "Response: ${response}"  # Debug: Check response data

  # Check if the response is as expected
  echo "Expected response starts with: ${get_expected_response}"
  if [[ "${response}" == "${get_expected_response}"* ]]; then
    echo -e "${GREEN}${get_api} endpoint passed${NC}"
    ((pass++))  # Increment pass variable
  else
    echo -e "${RED}${get_api} endpoint failed${NC}"
    ((fail++))  # Increment fail variable
  fi
  ((total++))  # Increment total variable
done


echo ""
echo -e "Tests: ${GREEN}${pass} passed${NC} / ${total} total"
echo -e "Tests: ${RED}${fail} failed${NC} / ${total} total"
