import React, { Component } from 'react'
import { Container, Form, Dimmer, Loader, Radio, Header, Grid, Card, Image, Icon, Button, Modal } from 'semantic-ui-react'
import axios from 'axios'
import html5 from '../assets/1.png'
import andrd from '../assets/2.png'
import larav from '../assets/3.png'
import react from '../assets/4.png'

const images = ['', html5, andrd, larav, react]
const defaultState = {
  modules: [],
  gender: 'M',
  selectedModules: [],
  message: '',
  openModal: false,
  loading: false,
  error: '',
  modalErrorOpen: false
}
export default class FormComp extends Component {
  constructor() {
    super()
    this.state = defaultState
    this.changeGender = this.changeGender.bind(this)
    this.addModule = this.addModule.bind(this)
    this.sendData = this.sendData.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.closeErrorModal = this.closeErrorModal.bind(this)
  }
  componentDidMount() {
    axios.get('http://grindhood.com/elis-api/module')
      .then((res) => {
        this.setState({
          modules: res.data.content
        })
      })
  }
  closeModal() {
    this.setState({
      openModal: false
    })
  }
  closeErrorModal() {
    this.setState({
      modalErrorOpen: false
    })
  }
  changeGender(e, { value }) {
    this.setState({
      gender: value
    })
  }
  addModule(id) {
    const index = this.state.selectedModules.indexOf(id)
    if (index === -1) {
      this.setState(prevState => ({
        selectedModules: [...prevState.selectedModules, id]
      }))
    } else {
      this.setState(prevState => ({
        selectedModules: prevState.selectedModules.filter(e => (e !== id))
      }))
    }
  }
  sendData() {
    const nombres = document.getElementById('nombres').value
    const apellidos = document.getElementById('apellidos').value
    const correo = document.getElementById('correo').value
    const celular = document.getElementById('celular').value
    const edad = document.getElementById('edad').value
    const universidad = document.getElementById('universidad').value
    const genero = this.state.gender
    const modules = this.state.selectedModules
    if (
      nombres.length === 0 ||
      apellidos.length === 0 ||
      correo.length === 0 ||
      celular.length === 0 ||
      universidad.length === 0 ||
      modules.length === 0
    ) {
      this.setState({
        error: 'Debes llenar todos los campos y elegir al menos un módulo.',
        modalErrorOpen: true,
        loading: false
      })
    } else {
      const data = {
        nombres,
        apellidos,
        cel: celular,
        correo,
        edad,
        sexo: genero,
        univ: universidad,
        modulos: modules
      }
      this.setState({
        loading: true
      })
      axios.post('http://grindhood.com/elis-api/student', data)
        .then((res) => {
          if (res.data.code === 200) {
            this.setState({
              modules: [],
              gender: 'M',
              selectedModules: [],
              error: '',
              modalErrorOpen: false,
              message: res.data.usrmsg,
              openModal: true,
              loading: false
            })
          } else {
            this.setState({
              error: res.data.usrmsg,
              modalErrorOpen: true,
              loading: false
            })
          }
        })
    }
  }
  render() {
    const {
      gender, modules, selectedModules, message, openModal, loading, error, modalErrorOpen
    } = this.state
    const ml = modules.length
    let modulesCont = null
    let modal = null
    let modalError = null
    if (error.length > 0) {
      modalError = (
        <Modal open={modalErrorOpen} basic size="small" onClose={this.closeErrorModal}>
          <Header icon="exclamation triangle" content="Atención" />
          <Modal.Content>
            <p>{error}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="red" onClick={this.closeErrorModal} inverted>
              <Icon name="checkmark" /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
      )
    }
    if (message.length > 0) {
      modal = (
        <Modal open={openModal} basic size="small" onClose={this.closeModal}>
          <Header icon="smile" content="Hecho" />
          <Modal.Content>
            <p>{message}</p>
          </Modal.Content>
          <Modal.Actions>
            <Button color="green" onClick={this.closeModal} inverted>
              <Icon name="checkmark" /> Ok
            </Button>
          </Modal.Actions>
        </Modal>
      )
    }
    if (ml > 0) {
      modulesCont = (
        <Grid columns={ml} stackable>
          <Grid.Row>
            {
              modules.map((module) => {
                let styles = {
                  cursor: 'pointer',
                  boxShadow: '3px 4px 14px 1px rgb(4,4,4)'
                }
                if (selectedModules.indexOf(module.id) !== -1) {
                  styles = {
                    ...styles,
                    transform: 'scale(0.8)',
                    background: '#9eae9e'
                  }
                }
                return (
                  <Grid.Column key={module.id}>
                    <Card style={styles} as="div" onClick={() => { this.addModule(module.id) }}>
                      <Image src={images[module.id]} />
                      <Card.Content>
                        <Card.Header>
                          {module.nombre}
                        </Card.Header>
                        <Card.Meta>
                          <b>Requisito: </b>{module.requisitos}
                        </Card.Meta>
                        <Card.Description>
                          {module.dsc}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Icon size="large" name="calendar" color="blue" />
                        <b>Día: </b>{module.dia} de {module.ini} a {module.fin}<br />
                        <Icon size="large" name="whatsapp" color="green" />
                        <a href={module.whatsapp} target="_blank">GRUPO WHATSAPP</a>
                      </Card.Content>
                    </Card>
                  </Grid.Column>
                )
              })
            }
          </Grid.Row>
        </Grid>
      )
    }
    return (
      <Container>
        {
          loading ?
            <Dimmer active>
              <Loader inverted content="Registrando" />
            </Dimmer> :
            null
        }
        {modal}
        {modalError}
        <Form size="big">
          <Form.Group widths="equal">
            <Form.Input id="nombres" required label="Nombres" placeholder="Nombres..." />
            <Form.Input id="apellidos" required label="Apellidos" placeholder="Apellidos..." />
          </Form.Group>

          <Form.Group>
            <Form.Input id="correo" required type="email" label="Correo" width={8} placeholder="Correo..." />
            <Form.Input id="celular" required type="number" label="Nro. Celular" width={6} placeholder="Celular..." />
            <Form.Input id="edad" required type="number" label="Edad" width={2} placeholder="Edad" />
          </Form.Group>

          <Form.Group inline>
            <span><b>Sexo:&nbsp;&nbsp;</b></span>
            <Form.Field control={Radio} label="Masculino" value="M" checked={gender === 'M'} onChange={this.changeGender} />
            <Form.Field control={Radio} label="Femenino" value="F" checked={gender === 'F'} onChange={this.changeGender} />
          </Form.Group>
          <Form.Input id="universidad" required label="Universidad" placeholder="Universidad..." />
        </Form>
        <Header as="h3"><b>Módulos: (Selecciona uno o varios)</b></Header>
        {modulesCont}
        <Button onClick={this.sendData} positive size="big">Registrarse</Button>
        <br /><br />
      </Container>
    )
  }
}
