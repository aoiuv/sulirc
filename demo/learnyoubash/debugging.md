 # Learn Bash

 ## DEBUGGING (Exercise 11 of 11)

  Okay, now you know how to write Bash scripts. But it's not so easy.
  Sometimes we have troubles and Bash gives us tools for debugging scripts.
  If we want to run a script in debug mode, we use a special option in our
  script's shebang:

     #!/bin/bash options

  These options are settings that change the shell's behavior. The following
  table is a list of options which might be useful to you:

 Flag Name        Description
 ---- ----------- ----------------------------------------------------------------------
  -f  noglob      Disable filename expansion (globbing).
  -i  interactive Script runs in interactive mode.
  -n  noexec      Read command, but don't execute them (syntax check).
  -t  —           Exit after first command.
  -v  verbose     Print each command to stdout before executing it.
  -x  xtrace      Print each command to stdout before executing it and expands commands.
