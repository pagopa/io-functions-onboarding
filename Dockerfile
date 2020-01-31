FROM circleci/node:10.18.1 as builder

RUN sudo apt-get update
RUN sudo apt-get --yes install ghostscript
RUN sudo apt-get --yes install libgs-dev

WORKDIR /usr/src/app

COPY / /usr/src/app

RUN sudo chmod -R 777 /usr/src/app \
  && yarn install \
  && yarn build

FROM mcr.microsoft.com/azure-functions/node:2.0-node10
LABEL maintainer="https://teamdigitale.governo.it"

RUN apt-get update
RUN apt-get --yes install ghostscript libgs-dev

ENV AzureWebJobsScriptRoot=/usr/src/app \
    AzureFunctionsJobHost__Logging__Console__IsEnabled=true

COPY --from=builder /usr/src/app /usr/src/app

