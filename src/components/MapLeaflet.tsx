import { useEffect, useMemo, useState } from "react";
import { MapContainer, ImageOverlay, Marker, LayerGroup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import {
    CRS,
    Icon,
    LatLng,
    type LatLngTuple,
    type LeafletMouseEvent,
} from "leaflet";
import type { Floor, MapName } from "../types/MapTypes";
import type { MapRef } from "react-leaflet/MapContainer";
import cameras from "../cameras.json";

type MapProps = {
    mapName: MapName;
    floor: Floor;
};

type MapContentProps = {
    show: boolean;
    map: string;
    floor: Floor;
};

type CameraPosition = number[][];

type CameraData = Record<string, Record<Floor, CameraPosition>>;

const typedCameras: CameraData = cameras;

function MapContent(props: MapContentProps) {
    const { show, map, floor } = props;

    const getImage = () => {
        return `/${map.toLowerCase()}/${floor}.jpg`;
    };

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

function Cams(props: { map: string; floor: Floor }) {
    const { map, floor } = props;

    const icon = new Icon({
        iconUrl: "/camera.svg",
        iconSize: [35, 35],
    });

    return (
        <LayerGroup>
            {typedCameras &&
                Object.values(typedCameras[map.toLowerCase()][floor]).map(
                    (pos) => {
                        if (pos.length == 2)
                            return (
                                <Marker
                                    icon={icon}
                                    position={pos as LatLngTuple}
                                    key={pos.toString()}
                                    draggable
                                ></Marker>
                            );
                    },
                )}
        </LayerGroup>
    );
}

export default function Map(props: MapProps) {
    const { mapName, floor } = props;

    const [map, setMap] = useState<MapRef>(null);
    const [location, setLocation] = useState<LatLng>();
    const [show, setShow] = useState<boolean>(true);

    const onClick = (e: LeafletMouseEvent) => {
        setLocation(e.latlng);
    };

    useEffect(() => {
        if (map) map.on("click", onClick);
    }, [map]);

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
    );

    return (
        <div className="flex h-screen flex-col">
            {/* <div>
                {location && <h3>{location.toString()}</h3>}
                <button onClick={() => setShow(!show)}>Click me!</button>
            </div> */}
            {displayMap}
        </div>
    );
}
