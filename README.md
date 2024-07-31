[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=IceWhaleTech_CasaOS-UI&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=IceWhaleTech_CasaOS-UI)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=IceWhaleTech_CasaOS-UI&metric=bugs)](https://sonarcloud.io/summary/new_code?id=IceWhaleTech_CasaOS-UI)
[![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=IceWhaleTech_CasaOS-UI&metric=code_smells)](https://sonarcloud.io/summary/new_code?id=IceWhaleTech_CasaOS-UI)
[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=IceWhaleTech_CasaOS-UI&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=IceWhaleTech_CasaOS-UI)
[![Duplicated Lines (%)](https://sonarcloud.io/api/project_badges/measure?project=IceWhaleTech_CasaOS-UI&metric=duplicated_lines_density)](https://sonarcloud.io/summary/new_code?id=IceWhaleTech_CasaOS-UI)

# How to develop this project

## Prerequisites
1. Node 16 ([installation instructions](https://github.com/nvm-sh/nvm?tab=readme-ov-file#usage))
2. Yarn@3.6.0 ([installation instructions](https://yarnpkg.com/getting-started/install))

## Environment variables
If you want to connect dev UI version to your local CasaOS server, you will need to set up a couple of env variables:
1. Copy `.env.dev` to `.env.dev.local` (this file is git-ignored)
2. Set `VUE_APP_DEV_IP` to IP address of your local CasaOS server

## Set up dev server
```shell
# install tool
yarn global add turbo

# install dependencies
yarn install

# build
yarn dev 
```

# How to build this project

```shell
# install tool
yarn global add turbo

# install dependencies
yarn install

# build
yarn build 
```

# How to test this project

```shell
yarn test
```

This project uses `vitest` for unit tests. 

# TODO how to deploy this project

# How to contribute to this project

CasaOS is a community-driven open source project and the people involved are CasaOS users. That means CasaOS will always
need contributions from community members just like you!

- See <https://wiki.casaos.io/en/contribute> for ways of contribution to CasaOS
- See <https://wiki.casaos.io/en/contribute/development> if you want to be involved in code contribution specificially

# TODO how to license this project

# How to contact this project

The word Casa comes from the Spanish word for "home". Project CasaOS originated as a pre-installed system for
crowdfunded product [ZimaBoard](https://www.zimaboard.com) on Kickstarter.

After looking at many systems and software on the market, the team found no server system designed for home scenarios,
sadly true.

So, we set out to build this open source project to develop CasaOS with our own hands, everyone in the community, and
you.

We believes that through community-driven collaborative innovation and open communication with global developers, we can
reshape the digital home experience like never before.

**A warm welcome for you to get help or share great ideas in the [Discord](https://discord.gg/knqAbbBbeX)!**

[![Discord Card](https://discordapp.com/api/guilds/884667213326463016/widget.png?style=banner2)](https://discord.gg/knqAbbBbeX)
