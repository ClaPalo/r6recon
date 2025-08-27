import React, { useEffect, useMemo, useState } from "react";
import {
    MapContainer,
    ImageOverlay,
    Marker,
    LayerGroup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { CRS, Icon, LatLng, type LatLngTuple, type LeafletMouseEvent } from "leaflet";
import type { Floor } from "../types/MapTypes";
import type { MapRef } from "react-leaflet/MapContainer";
import cameras from '../cameras.json'

type MapContentProps = {
    show: boolean;
    map: string;
    floor: Floor;
};

type CameraPosition = number[][]

type CameraData = Record<string, Record<Floor, CameraPosition>>

const typedCameras: CameraData = cameras

function MapContent(props: MapContentProps) {
    const { show, map, floor } = props;

    const getImage = () => {
        return `/${map.toLowerCase()}/${floor}.jpg`
    }

    return (
        <>
            <ImageOverlay
                url={getImage()}
                bounds={[
                    [0, 0],
                    [800, 1500],
                ]}
            />
            {show && <Cams map={map} floor={floor} />}
        </>
    );
}

function Cams(props: { map: string, floor: Floor} ) {
    const { map, floor } = props

    const icon = new Icon({
        iconUrl: '/camera.svg',
        iconSize: [35, 35]
    })

    return (
        <LayerGroup>
            {typedCameras && Object.values(typedCameras[map.toLowerCase()][floor]).map((pos) => {
                if (pos.length == 2) 
                    return <Marker icon={icon} position={pos as LatLngTuple} key={pos.toString()}></Marker>
            })}
        </LayerGroup>
    );
}

export default function Map() {
    const [map, setMap] = useState<MapRef>(null)
    const [location, setLocation] = useState<LatLng>()

    const [show, setShow] = useState<boolean>(true);
    const [mapName] = useState<string>('Chalet')
    const [floor, setFloor] = useState<Floor>('basement')

    const onClick = (e: LeafletMouseEvent) => {
        setLocation(e.latlng)
    }

    useEffect(() => {
        if (map) map.on('click', onClick)
    }, [map])

    const displayMap = useMemo(
        () => (
            <MapContainer
                center={[400, 750]}
                zoom={0}
                maxZoom={2}
                scrollWheelZoom={true}
                className="map"
                crs={CRS.Simple}
                boundsOptions={{ maxZoom: 0 }}
                maxBounds={[
                    [-500, -500],
                    [1300, 2000],
                ]}
                ref={setMap}
            >
                <MapContent show={show} map={mapName} floor={floor} />
            </MapContainer>
        ),
        [floor, mapName, show],
    )

    return (
        <>
            {location && <h3>{location.toString()}</h3>}
            <button onClick={() => setShow(!show)}>Click me!</button>
            <div style={{flex: "row"}}>
                <button onClick={() => setFloor("basement")}>Basement</button>
                <button onClick={() => setFloor("first")}>First</button>
                <button onClick={() => setFloor("second")}>Second</button>
                <button onClick={() => setFloor("roof")}>Roof</button>
            </div>
            {displayMap}
        </>
    );
}
