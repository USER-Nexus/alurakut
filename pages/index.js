import MainGrid from '../src/components/MainGrid'
import Box from '../src/components/Box'
import { AlurakutMenu, AlurakutMeny, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';

function ProfileSideBar(properties) {
  console.log(properties);
  return (
    <Box>
      <img src={`https://github.com/${properties.githubUser}.png`} style={{ borderRadius: '8px' }} />
    </Box>
  )
}

export default function Home() {
  const user = 'user-nexus'
  const friends = [
    'juunegreiros',
    'omariosouto',
    'peas',
    'codediodeio',
    'tmwilliamlin168'
  ]

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
      </div>
      <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
        <ProfileRelationsBoxWrapper>  
          <h2 className="smallTitle">
            Amigos ({friends.length})
          </h2>

          <ul>
          {friends.map((item) => {
            return (
              <li>
                <a href={`/users/${item}`} key={item}>
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
  