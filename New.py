from minecraft.networking.connection import Connection
from minecraft.networking.packets import clientbound, serverbound
import time
import threading
import random

HOST = "play.shulkermc.fun"
PORT = 25565
USERNAME = "Joonathanjodd"

PASSWORD = "Jeet001"

connection = Connection(
    HOST,
    PORT,
    username=USERNAME
)

spawned = False


def handle_join(packet):
    global spawned

    print("Joined server")

    if not spawned:
        spawned = True

        def actions():

            # Wait before login
            time.sleep(8)

            connection.write_packet(
                serverbound.play.ChatPacket(
                    message=f"/login {PASSWORD}"
                )
            )

            print("Sent login")

            # Wait before lifesteal
            time.sleep(10)

            connection.write_packet(
                serverbound.play.ChatPacket(
                    message="/server lifesteal"
                )
            )

            print("Joining lifesteal")

            # AFK loop
            while True:

                yaw = random.randint(0, 360)
                pitch = random.randint(-20, 20)

                try:
                    connection.write_packet(
                        serverbound.play.PositionAndLookPacket(
                            x=0,
                            feet_y=0,
                            z=0,
                            yaw=yaw,
                            pitch=pitch,
                            on_ground=True
                        )
                    )
                except:
                    pass

                print("AFK action")

                time.sleep(15)

        threading.Thread(target=actions).start()


# Listen for spawn/join packets
connection.register_packet_listener(
    handle_join,
    clientbound.play.JoinGamePacket
)

print("Connecting...")

connection.connect()
