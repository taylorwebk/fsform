import React from 'react'
import { Container, Header, Image } from 'semantic-ui-react'
import fslogo from '../assets/FULLSTACK.png'

const HeaderComp = () => (
  <Container textAlign="center">
    <br /><br />
    <Image src={fslogo} size="medium" centered />
    <Header as="h1" color="blue">
      Registro de Estudiantes
      <Header.Subheader>
        Registrate para tomar los cursos y formar parte de nuestra gran comunidad.
      </Header.Subheader>
    </Header>
    <br />
  </Container>
)
export default HeaderComp
