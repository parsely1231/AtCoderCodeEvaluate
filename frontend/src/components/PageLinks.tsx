import React from "react";
import {Button, ButtonGroup} from "@material-ui/core"


export const PageLinks = () => {

  return (
    <ButtonGroup className="pagelinks">
      <Button href="#/table">
        Table
      </Button>

      <Button href="#/user">
        User
      </Button>

      <Button href="#/">
        Home
      </Button>
    </ButtonGroup>
  )
}
