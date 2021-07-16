import React from 'react';
import nookies from 'nookies';
import jwt from 'jsonwebtoken';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutMeny, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(properties) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${properties.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />

      <p>
        <a className="boxLink" href={`http://github.com/${properties.githubUser}`}>
          @{properties.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(properties) {
  return (
    <ProfileRelationsBoxWrapper> 
      <h2 className="smallTitle">
        {properties.title} ({properties.items.length})
      </h2>
      <ul>
        {/* {followers.map((item) => {
          return (
            <li key={item}>
              <a href={`http://github.com/${item}.png`}>
                <img src={item.image} />
                <span>{item.title}</span>
              </a>
            </li>
          )
        })} */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home(props) {
  const user = props.githubUser;
  const friends = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'codediodeio',
    'tmwilliamlin168'
  ]
  const [communities, setCommunities] = React.useState([]);
  console.log(communities)
  
  const [followers, setFollowers] = React.useState([]);
  React.useEffect(function() {
    //GET
    fetch('https://api.github.com/users/user-nexus/followers')
    .then(function(response) {
      return response.json();
    }) 
    .then(function(finalResponse) {
      setFollowers(finalResponse);
    })

    //Api GraphQL
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: {
        'Authorization': 'ff9096c5f4a5ba0cbd60a280fb399a',
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ "query": `query {
        allCommunities {
          title
          id
          imageUrl
          creatorslug
        }
      }` })
    })
    .then((response) => response.json())
    .then((completeResponse) => {
      const datoCommunities = completeResponse.data.allCommunities;
      setCommunities(datoCommunities)
      console.log(datoCommunities);
    })

  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
      <div className="profileArea" style={{ gridArea: 'profileArea' }}>
        <ProfileSideBar githubUser={user} />
      </div>
      <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
        <Box>
          <h1 className="title">
            Bem-vindo(a)
          </h1>

          <OrkutNostalgicIconSet />
        </Box>

        <Box>
          <h2 className="subTitle">O que você deseja fazer ?</h2>
          <form onSubmit={function handleCreateCommunity(e) {
            e.preventDefault();
            const dataForm = new FormData(e.target);

            console.log('Campo: ', dataForm.get('title'));
            console.log('Campo: ', dataForm.get('image'));
            
            const community = {
              title: dataForm.get('title'),
              imageUrl: dataForm.get('image'),
              creatorslug: user,
            }

            fetch('/api/communities', {
              method: 'POST',
              headers: {
                'Content-type': 'application/json'
              },
              body: JSON.stringify(community)
            })
            .then(async (response) => {
              const data = await response.json();
              console.log(data.createdRecord);
              const community = data.createdRecord;
              const updatedCommunities = [...communities, community];
              setCommunities(updatedCommunities)
            })
            
          }}>
            <div>
              <input 
                placeholder="Qual vai ser o nome da sua comunidade?"
                name="title" 
                aria-label="Qual vai ser o nome da sua comunidade?"
                type="text"
              />
            </div>
            <div>
              <input 
                placeholder="Coloque uma URL para ser usada como capa"
                name="image" 
                aria-label="Coloque uma URL para ser usada como capa"                
              />
            </div>

            <button>
              Criar comunidade
            </button>
          </form>
        </Box>
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>       
        <ProfileRelationsBox title="Seguidores" items={followers} />
        <ProfileRelationsBoxWrapper> 
          <h2 className="smallTitle">
            Comunidades ({communities.length})
          </h2>

          <ul>
            {communities.map((item) => {
              return (
                <li key={item.id}>
                  <a href={`/communities/${item.id}`}>
                    <img src={item.imageUrl} />
                    <span>{item.title}</span>
                  </a>
                </li>
              )
            })}
          </ul>
        </ProfileRelationsBoxWrapper>          
        <ProfileRelationsBoxWrapper>  
          <h2 className="smallTitle">
            Amigos ({friends.length})
          </h2>

          <ul>
          {friends.map((item) => {
            return (
              <li key={item}>
                <a href={`/users/${item}`}>
                  <img src={`http://github.com/${item}.png`} />
                  <span>{item}</span>
                </a>
              </li>
            )
          })}
          </ul>

        </ProfileRelationsBoxWrapper>
      </div>
      </MainGrid>
    </>
  )
}
  

export async function getServerSideProps(context) {
  const cookies = nookies.get(context)
  const token =  cookies.USER_TOKEN

  const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
    headers: {
      Authorization: token
    }
  })
  .then((response) => response.json())

  if(!isAuthenticated) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      }
    }
  }

  const { githubUser } = jwt.decode(token);
  return {
    props: {
      githubUser
    }, 
  }
}